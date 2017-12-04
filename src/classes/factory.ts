import {Connection}       from 'mysql2';
import SelectBuilder      from './builders/select';
import SelectCountBuilder from './builders/select-count';
import SelectOneBuilder   from './builders/select-one';
import InsertBuilder      from './builders/insert';
import UpdateBuilder      from './builders/update';
import DeleteBuilder      from './builders/delete';

export default class Factory {
  
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }
  
  selectFrom(table: string) {
    return new SelectBuilder(this.connection, table);
  }
  
  selectCountFrom(table: string) {
    return new SelectCountBuilder(this.connection, table);
  }
  
  selectOneFrom(table: string) {
    return new SelectOneBuilder(this.connection, table);
  }
  
  insertInto(table: string) {
    return new InsertBuilder(this.connection, table);
  }
  
  update(table: string) {
    return new UpdateBuilder(this.connection, table);
  }
  
  deleteFrom(table: string) {
    return new DeleteBuilder(this.connection, table);
  }
  
}
