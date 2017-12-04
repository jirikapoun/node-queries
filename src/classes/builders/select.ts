import {ServerResponse as Response}  from 'http';
import * as mysql                    from 'mysql2';
import IEnhancedResponse from '../../interfaces/enhanced-response';
import AbstractBuilder   from './abstract';

export default class SelectBuilder extends AbstractBuilder {
  
  public constructor(connection: mysql.Connection, table: string) {
    let statement = mysql.format(
      'SELECT ??.* FROM ??',
      [ table, table ]
    );
    super(connection, statement, table);
  }
  
  public joinUsing(joinTable: string, using: string): this {
    return this.createJoinUsingStatement(joinTable, using);
  }
  
  public joinOn(joinTable: string, firstKey: string, secondKey: string): this {
    return this.createJoinOnStatement(joinTable, firstKey, secondKey);
  }
  
  
  
  protected where(criteria: any): this {
    return this.createWhereStatement(criteria);
  }

  protected whereAny(criteria: any): this {
    return this.createWhereStatement(criteria, true);
  }

  protected whereIfNotEmpty(criteria: any): this {
    return this.createWhereStatement(criteria, false, true);
  }
  
  protected whereLike(criteria: any): this {
    return this.createWhereLikeStatement(criteria, false);
  }
  
  protected orderBy(column: string, ascOrDesc: string): this {
    return this.createOrderByStatement(column, ascOrDesc);
  }
  
  protected limitOffset(limit: number, offset: number): this {
    return this.setLimitOffset(limit, offset);
  }
  
  protected postprocess(callback: (record: any) => void): this {
    return this.setPostprocessor(callback);
  }
  
  protected returnResponse(response: IEnhancedResponse, records: any[]): void {
    response.handlers.returnRecords(records);
  }
}
