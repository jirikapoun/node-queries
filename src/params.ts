export default class Params {
  
  constructor(request: any) {
    let params = request.swagger.params;
    for (let name in params) {
      let value = params[name].value;
      this[name] = value;
    }
  }
  
}
