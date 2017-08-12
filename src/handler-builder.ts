import EnhancedResponse   from './enhanced-response';
import SelectHandler      from './handlers/select';
import SelectCountHandler from './handlers/select-count';
import SelectOneHandler   from './handlers/select-one';
import CustomQueryHandler from './handlers/custom-query';

export default class HandlerBuilder {
  
  private response: EnhancedResponse;
  
  constructor(response: EnhancedResponse) {
    this.response = response;
  }
  
  selectFrom(table: string) {
    return new SelectHandler(this.response, table);
  }
  
  selectCountFrom(table: string) {
    return new SelectCountHandler(this.response, table);
  }
  
  selectOneFrom(table: string) {
    return new SelectOneHandler(this.response, table);
  }
  
}
