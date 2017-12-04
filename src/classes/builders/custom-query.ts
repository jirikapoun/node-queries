import * as mysql        from 'mysql2';
import IEnhancedResponse from '../../interfaces/enhanced-response';

export default class CustomQueryBuilder {
  
  private connection: mysql.Connection;
  private sql:        string;
  private values_:    any[]
  
  private limit:  number;
  private offset: number;
  
  private callback: (records: any[]) => void;
  
  public constructor(connection: mysql.Connection, sql: string) {
    this.connection = connection;
    this.sql        = sql;
    this.values_    = [];
  }
  
  public values(values: any[]): this {
    this.values_ = values;
    return this;
  }
  
  public limitOffset(limit: number, offset: number): this {
    this.limit  = limit;
    this.offset = offset;
    return this;
  }
  
  public postprocess(callback: (records: any[]) => void): this {
    this.callback = callback;
    return this;
  }
  
  public execute(response: IEnhancedResponse): void {
    if (this.limit >= 0) {
      this.sql += ' LIMIT ?';
      this.values_.push(this.limit);
      
      if (this.offset > 0) {
        this.sql += ' OFFSET ?';
        this.values_.push(this.offset);
      }
    }
    else if (this.offset > 0) {
      this.sql += ' LIMIT 18446744073709551615 OFFSET ?';
      this.values_.push(this.offset);
    }
    
    this.connection.query(this.sql, this.values_, (error : any, records : any[]) => {
      if (error) {
        let sql = mysql.format(this.sql, this.values_);
        console.error(error);
        console.trace('Query failed: ' + sql);
        return response.internalServerError();
      }
      else {
        if (this.callback) {
          try {
            for (let i = 0; i < records.length; i++)
              this.callback(records[i]);
            return response.handlers.returnRecords(records);
          }
          catch (e) {
            console.trace(e);
            return response.internalServerError();
          }
        }
        else {
          return response.handlers.returnRecords(records);
        }
      }
    });
  }
  
}