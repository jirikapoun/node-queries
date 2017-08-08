import SelectHandler    from './handlers/select';
import SelectOneHandler from './handlers/select-one';

export default class HandlerBuilder {
  
  private response : any;
  
  constructor(response : any) {
    this.response = response;
  }
  
  selectFrom(table : string) {
    return new SelectHandler(this.response, table);
  }
  
  selectOneFrom(table : string) {
    return new SelectOneHandler(this.response, table);
  }
  
}
