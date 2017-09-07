import * as mysql       from 'mysql2';
import db               from '../db';
import EnhancedResponse from '../enhanced-response';
import AbstractHandler  from './abstract';

export default class SelectHandler extends AbstractHandler {
  
  public constructor(response: EnhancedResponse, table: string) {
    let statement = mysql.format(
      'SELECT ??.* FROM ??',
      [ table, table ]
    );
    super(response, statement, table);
  }
  
  public joinUsing(joinTable: string, using: string): this {
    return this.createJoinUsingStatement(joinTable, using);
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
  
  protected returnResponse(response: EnhancedResponse, records: any[]): void {
    response.handlers.returnRecords(records);
  }
}
