import * as mysql        from 'mysql2';
import IEnhancedResponse from '../../interfaces/enhanced-response';
import AbstractBuilder   from './abstract';

export default class InsertBuilder extends AbstractBuilder {
  
  private locationPath: string;
  
  public constructor(connection: mysql.Connection, table: string) {
    let statement = mysql.format(
      'INSERT INTO ??',
      [ table ]
    );
    super(connection, statement, table);
  }
  
  public set(record: any): this {
    return this.setRecord(record);
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
  
  public checkOrSet(expectedValues: any): this {
    return super.setExpectedValues(expectedValues);
  }
  
  public unsetIfNull(fields: string[]): this {
    return super.setUnsettableFields(fields);
  }
  
  public checkIfNotNull(fields: string[]): this {
    return super.setNotNullFields(fields);
  }
  
  public preprocess(callback: (record: any) => void): this {
    return super.setPreprocessor(callback);
  }
  
  public location(path: string): this {
    this.locationPath = path;
    return this;
  }
  
  protected returnResponse(response: IEnhancedResponse, result: any): void {
    response.created(this.locationPath + '/' + result.insertId);
  }
  
}
