import * as mysql       from 'mysql2';
import EnhancedResponse from '../enhanced-response';
import Query            from '../query';
import IQuery           from '../interfaces/query';
import ICheck           from '../interfaces/check';
import SimpleCheck      from '../checks/simple';
import ForeignCheck     from '../checks/foreign';
import JoinedCheck      from '../checks/joined';
import db               from '../db';

export default abstract class AbstractHandler {
  
  private response: EnhancedResponse;
  private query:    Query;
  private table:    string;
  
  private record:           any;
  private expectedValues:   any;
  private unsettableFields: string[];
  private notNullFields:    string[];
  
  private preprocessor:  (record: any) => void;
  private postprocessor: (record: any) => void;
  private location:          string;
  
  private checks: ICheck[];
  
  public constructor(response: EnhancedResponse, statement: string, table?: string) {
    this.response = response;
    this.query    = new Query(statement);
    this.table    = table;
  }
  
  protected createJoinUsingStatement(joinTable: string, using: string): this {
    let statement = mysql.format(
      'JOIN ?? USING (??)',
      [ joinTable, using ]
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
  
  protected createOrderStatement(column: string, ascOrDesc: string): this { /** @todo enum? */
    let statement = mysql.format(
      '?? ' + (ascOrDesc || 'ASC'),
      [ column ]
    );
    this.query.addJoinStatement(statement);
    return this;
  }
  
  protected addSimpleCheck(column: string, value: any): this {
    let check = new SimpleCheck(this.table, column, value);
    this.checks = this.checks || [];
    this.checks.push(check);
    return this;
  }
  
  protected addJoinedCheck(joinedTable: string, using: string, column: string, value: any): this {
    let check = new JoinedCheck(this.table, joinedTable, using, column, value);
    this.checks = this.checks || [];
    this.checks.push(check);
    return this;
  }
  
  protected addForeignCheck(table: string, keyColumn: string, keyValue: any, column: string, value: any): this {
    let check = new ForeignCheck(table, keyColumn, keyValue, column, value);
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
  
  protected setNotNullFields(fields: string[]): this {
    this.notNullFields = fields;
    return this;
  }
  
  protected setPreprocessor(preprocessor: (record: any) => void): this {
    this.preprocessor = preprocessor;
    return this;
  }
  
  protected setPostprocessor(postprocessor: (record: any) => void): this {
    this.postprocessor = postprocessor;
    return this;
  }
  
  protected setLocation(location: string): this {
    this.location = location;
    return this;
  }
  
  protected abstract returnResponse(response: EnhancedResponse, records: any[]): void;
  
  public execute(): void {
    let statement = this.query.toString();
    db.query(statement, (error: any, records: any[]) => {
      if (error) {;
        console.error(error);
        console.trace('Query failed: ' + statement);
        return this.response.internalServerError();
      }
      else {
        if (this.postprocessor) {
          try {
            for (let i = 0; i < records.length; i++)
              this.postprocessor(records[i]);
            this.returnResponse(this.response, records);
          }
          catch (e) {
            console.trace(e);
            return this.response.internalServerError();
          }
        }
        else {
          this.returnResponse(this.response, records);
        }
      }
    });
  }
  
}

