import IEnhancedResponse  from '../interfaces/enhanced-response';
import SelectBuilder      from './builders/select';
import SelectCountBuilder from './builders/select-count';
import SelectOneBuilder   from './builders/select-one';
import InsertBuilder      from './builders/insert';
import UpdateBuilder      from './builders/update';
import DeleteBuilder      from './builders/delete';

export default class Factory {
  
  private response: IEnhancedResponse;
  
  constructor(response: IEnhancedResponse) {
    this.response = response;
  }
  
  selectFrom(table: string) {
    return new SelectBuilder(this.response, table);
  }
  
  selectCountFrom(table: string) {
    return new SelectCountBuilder(this.response, table);
  }
  
  selectOneFrom(table: string) {
    return new SelectOneBuilder(this.response, table);
  }
  
  insertInto(table: string) {
    return new InsertBuilder(this.response, table);
  }
  
  update(table: string) {
    return new UpdateBuilder(this.response, table);
  }
  
  deleteFrom(table: string) {
    return new DeleteBuilder(this.response, table);
  }
  
}
