import * as mysql from 'mysql2';

class DB {
  
  public connection: mysql.Connection;
  
  public init(options: mysql.ConnectionOptions) {
    this.connection = mysql.createConnection(options);
    this.connection.connect();
  }
  
  public query<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
  public query<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query {
    return this.connection.query(sql, values, callback);
  }
  
}

export default new DB;
