import SelectBuilder      from './builders/select';
import SelectCountBuilder from './builders/select-count';
import SelectOneBuilder   from './builders/select-one';
import InsertBuilder      from './builders/insert';
import UpdateBuilder      from './builders/update';
import DeleteBuilder      from './builders/delete';

export default class Factory {
  
  selectFrom(table: string) {
    return new SelectBuilder(table);
  }
  
  selectCountFrom(table: string) {
    return new SelectCountBuilder(table);
  }
  
  selectOneFrom(table: string) {
    return new SelectOneBuilder(table);
  }
  
  insertInto(table: string) {
    return new InsertBuilder(table);
  }
  
  update(table: string) {
    return new UpdateBuilder(table);
  }
  
  deleteFrom(table: string) {
    return new DeleteBuilder(table);
  }
  
}
