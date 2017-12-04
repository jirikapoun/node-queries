import * as mysql        from 'mysql2';
import {Observable}      from 'rxjs';
import ICheck            from '../../interfaces/check';
import IEnhancedResponse from '../../interfaces/enhanced-response';
import IQuery            from '../../interfaces/query';
import Query             from '../query';
import SimpleCheck       from '../checks/simple';
import ForeignCheck      from '../checks/foreign';
import JoinedCheck       from '../checks/joined';

abstract class AbstractBuilder {
  
  private connection: mysql.Connection;
  private query:      Query;
  private table:      string;
  
  private record:               any;
  private expectedValues:       any;
  private unsettableFields:     string[];
  private unchangeableFields:   string[];
  private notNullFields:        string[];
  private unsetOrNotNullFields: string[];
  
  private preprocessor:  (record: any) => any;
  private postprocessor: (record: any) => any;
  
  private checks: ICheck[];
  
  private response: IEnhancedResponse;
  private successHandler:      (records: any[]) => void;
//  private errorHandler:        (error: any) => void;
//  private invalidValueHandler: (message: string) => void;
  
  public constructor(connection: mysql.Connection, statement: string, table?: string) {
    this.connection = connection;
    this.query      = new Query(statement);
    this.table      = table;
  }
  
  public onSucess(handler: (records: any[]) => void): this {
    this.successHandler = handler;
    return this;
  }
  
//  public onError() {}
  
//  public onInvalidValue() {}
  
  public otherwiseRespond(response: IEnhancedResponse): this {
    this.response = response;
    
    if (!this.successHandler) {
      this.successHandler = (records: any[]) => {
        return this.returnResponse(this.response, records);
      };
    }
    
//    if (!this.errorHandler) {
//      this.errorHandler = (error: any) => {
//        console.trace(error);
//        return this.response.internalServerError();
//      }
//    }
//    
//    if (!this.invalidValueHandler) {
//      this.invalidValueHandler = (message: string) => {
//        return this.response.badRequest(message);
//      }
//    }
    return this;
  }
  
  public respond(response: IEnhancedResponse): this {
    this.response = response;
    this.successHandler = (records: any[]) => {
      return this.returnResponse(this.response, records);
    };
    return this;
  }
  
  public execute(): void {
    
    if (this.notNullFields) {
      for (let field of this.notNullFields) {
        if (this.record[field] == null)
          return this.response.badRequest("Field '" + field + "' has to be set");
      }
    }
    
    if (this.unsetOrNotNullFields) {
      for (let field of this.unsetOrNotNullFields) {
        if (this.record[field] === null)
          return this.response.badRequest("Field '" + field + "' has to be either unset or not null");
      }
    }
    
    if (this.unsettableFields) {
      for (let field of this.unsettableFields) {
        if (this.record[field] == null)
          delete this.record[field];
        else
          return this.response.badRequest("Field '" + field + "' cannot be set explicitly");
      }
    }
    
    for (let field in this.expectedValues) {
      if (this.record[field] == null)
        this.record[field] = this.expectedValues[field];
      else if (this.record[field] !== this.expectedValues[field])
        return this.response.badRequest("Invalid value '" + this.record[field] + "' in field '" + field + "', should be '" + this.expectedValues[field] + "'");
    }
    
    if (this.preprocessor) {
      try {
        this.record = this.preprocessor(this.record);
      }
      catch (e) {
        console.trace(e);
        return this.response.badRequest('Received record could not be processed');
      }
    }
    
    if (this.record) {
      let setStatement = mysql.escape(this.record);
      this.query.setSetStatement(setStatement);
    }
    
    if (this.checks) {
      let whereStatements = this.query.getWhereStatements();
      let observables = this.checks.map(check => check.check(whereStatements));
      Observable
        .combineLatest(observables)
        .subscribe(results => {
          let notFound  = results.some(result => result === null);
          let forbidden = results.some(result => result === false);
          
          if (notFound)
            this.response.notFound();
          else if (forbidden)
            this.response.forbidden();
          else
            this.runQuery();
        });
    }
    else
      this.runQuery();
      
  }
  
  protected createJoinUsingStatement(joinTable: string, using: string): this {
    let statement = mysql.format(
      'JOIN ?? USING (??)',
      [ joinTable, using ]
    );
    this.query.addJoinStatement(statement);
    return this;
  }
  
  protected createJoinOnStatement(joinTable: string, firstKey: string, secondKey: string): this {
    let statement = mysql.format(
      'JOIN ?? ON ?? = ??',
      [ joinTable, firstKey, secondKey ]
    );
    this.query.addJoinStatement(statement);
    return this;
  }

  protected createWhereStatement(criteria: any, disjunctive: boolean = false, checkEmptiness: boolean = false): this {
    let subStatements = [];
    for (let key in criteria) {
      let value = criteria[key];
      if (value || !checkEmptiness) {
        let statement = mysql.format(
          '?? IN (?)',
          [ key, value ]
        );
        subStatements.push(statement);
      }
    }
    
    if (subStatements.length > 0) {
      let statement = '(' + subStatements.join(disjunctive ? ' OR ' : ' AND ') + ')';
      this.query.addWhereStatement(statement);
    }
    return this;
  }
  
  protected createWhereLikeStatement(criteria: any, disjunctive: boolean = false, checkEmptiness: boolean = true): this {
    let subStatements = [];
    for (let key in criteria) {
      let value = criteria[key];
      if (value || !checkEmptiness) {
        let statement = mysql.format(
          "?? LIKE CONCAT('%', ?, '%')",
          [ key, value ]
        );
        subStatements.push(statement);
      }
    }
    
    if (subStatements.length > 0) {
      let statement = '(' + subStatements.join(disjunctive ? ' OR ' : ' AND ') + ')';
      this.query.addWhereStatement(statement);
    }
    return this;
  }
  
  protected createOrderByStatement(column: string, ascOrDesc: string): this { /** @todo enum? */
    let statement = mysql.format(
      '?? ' + (ascOrDesc || 'ASC'),
      [ column ]
    );
    this.query.addOrderByStatement(statement);
    return this;
  }
  
  protected addSimpleCheck(column: string, value: any): this {
    let check = new SimpleCheck(this.connection, this.table, column, value);
    this.checks = this.checks || [];
    this.checks.push(check);
    return this;
  }
  
  protected addJoinedCheck(joinedTable: string, using: string, column: string, value: any): this {
    let check = new JoinedCheck(this.connection, this.table, joinedTable, using, column, value);
    this.checks = this.checks || [];
    this.checks.push(check);
    return this;
  }
  
  protected addForeignCheck(table: string, keyColumn: string, keyValue: any, column: string, value: any): this {
    let check = new ForeignCheck(this.connection, table, keyColumn, keyValue, column, value);
    this.checks = this.checks || [];
    this.checks.push(check);
    return this;
  }
  
  protected setLimitOffset(limit: number, offset: number): this {
    this.query.setLimitOffset(limit, offset);
    return this;
  }
  
  protected setRecord(record: any): this {
    this.record = record;
    return this;
  }
  
  protected setExpectedValues(values: any): this {
    this.expectedValues = values;
    return this;
  }
  
  protected setUnsettableFields(fields: string[]): this {
    this.unsettableFields = fields;
    return this;
  }
  
  protected setUnchangeableFields(fields: string[]): this {
    this.unchangeableFields = fields;
    return this;
  }
  
  protected setNotNullFields(fields: string[]): this {
    this.notNullFields = fields;
    return this;
  }
  
  protected setUnsetOrNotNullFields(fields: string[]): this {
    this.unsetOrNotNullFields = fields;
    return this;
  }
  
  protected setPreprocessor(preprocessor: (record: any) => any): this {
    this.preprocessor = preprocessor;
    return this;
  }
  
  protected setPostprocessor(postprocessor: (record: any) => any): this {
    this.postprocessor = postprocessor;
    return this;
  }
  
  protected abstract returnResponse(response: IEnhancedResponse, records: any[]): void;
  
  private runQuery(): void {
    let statement = this.query.toString();
    this.connection.query(statement, (error: any, records: any[]) => {
      if (error) {
        console.error(error);
        console.trace('Query failed: ' + statement);
        return this.response.internalServerError();
      }
      else {
        if (this.postprocessor) {
          try {
            for (let i = 0; i < records.length; i++) {
              let result = this.postprocessor(records[i]);
              if (result !== undefined)
                records[i] = result;
            }
          }
          catch (e) {
            console.trace(e);
            return this.response.internalServerError();
          }
        }
        if (this.successHandler)
          this.successHandler(records);
        else
          this.returnResponse(this.response, records);
      }
    });
  }
  
}

export default AbstractBuilder;
