import * as mysql       from 'mysql2';
import db               from '../db';
import EnhancedResponse from '../enhanced-response';
import AbstractHandler  from './abstract';

export default class SelectCountHandler extends AbstractHandler {
  
  public constructor(response: EnhancedResponse, table: string) {
    let statement = mysql.format(
      'SELECT COUNT(*) AS "count" FROM ??',
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
  
  protected returnResponse(response: EnhancedResponse, records: any[]): void {
    let count: number = records[0]['count'];
    response.ok(count.toString(), 'text/plain');
  }
}
