import * as mysql       from 'mysql2';
import db               from '../db';
import EnhancedResponse from '../enhanced-response';
import AbstractHandler  from './abstract';

export default class DeleteHandler extends AbstractHandler {
  
  public constructor(response: EnhancedResponse, table: string) {
    let statement = mysql.format(
      'DELETE FROM ??',
      [ table ]
    );
    super(response, statement, table);
  }

  protected where(criteria: any): this {
    return this.createWhereStatement(criteria);
  }
  
  public checkPermission(column: string, value: any): this {
    return this.addSimpleCheck(column, value);
  }
  
  public checkPermissionWithJoin(joinedTable: string, using: string, column: string, value: any): this {
    return this.addJoinedCheck(joinedTable, using, column, value);
  }
  
  public checkPermissionElsewhere(table: string, keyColumn: string, keyValue: any, column: string, value: any): this {
    return this.addForeignCheck(table, keyColumn, keyValue, column, value);
  }
  
  protected returnResponse(response: EnhancedResponse, result: any): void {
    response.noContent();
  }
  
}
