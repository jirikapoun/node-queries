import * as mysql                       from 'mysql2';
import {Connection, ConnectionOptions } from 'mysql2';

class DB {
  
  public connection: Connection;
  
  init(options: ConnectionOptions) {
    this.connection = mysql.createConnection(options);
  }
  
}

export default new DB;
