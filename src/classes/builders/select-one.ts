import * as mysql        from 'mysql2';
import IEnhancedResponse from '../../interfaces/enhanced-response';
import AbstractBuilder   from './abstract';
import db                from '../../db';

export default class SelectOneBuilder extends AbstractBuilder {
  
  public constructor(response: IEnhancedResponse, table: string) {
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
  
  protected postprocess(callback: (record: any) => void): this {
    return this.setPostprocessor(callback);
  }
  
  protected returnResponse(response: IEnhancedResponse, records: any[]): void {
    response.handlers.returnFirstRecord(records);
  }
}

