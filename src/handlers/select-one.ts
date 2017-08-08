import * as mysql from 'mysql2';

var connection = mysql.createConnection({
  host:     "vps.jkapoun.cz",
  port:      3306,
  user:     "recepty",
  password: "iUW$A916K8",
  database: "recepty"
});

export default class SelectOneHandler {
  
  private response: any;
  private table:    string;

  private whereStatements:  string[];
  private whereValues:      any[];
  
  private callback : (record: any) => void;
  
  public constructor(response: any, table: string) {
    this.response        = response;
    this.table           = table;
    this.whereStatements = [];
    this.whereValues     = [];
  }

  public where(fieldsAndValues: any) : this {
    for (let key in fieldsAndValues) {
      let value = fieldsAndValues[key];
      this.whereStatements.push('?? = ?');
      this.whereValues    .push(key, value);
    }
    return this;
  }
  
  public postprocess(callback: (record: any) => void) : this {
    this.callback = callback;
    return this;
  }
  
  public execute() : void {
    let statement: string = 'SELECT * FROM ??';
    let values:    any[]  = [ this.table ];
    
    if (this.whereStatements) {
      statement += ' WHERE ' + this.whereStatements.join(' AND ');
      Array.prototype.push.apply(values, this.whereValues);
    }
    
    connection.query(statement, values, (error : any, records : any[]) => {
      if (error) {
        let sql = mysql.format(statement, values);
        console.error(error);
        console.trace('Query failed: ' + sql);
        return this.response.internalServerError();
      }
      else {
        if (this.callback && records.length > 0) {
          try {
            this.callback(records[0]);
            return this.response.handlers.returnFirstRecord(records);
          }
          catch (e) {
            console.trace(e);
            return this.response.internalServerError();
          }
        }
        else {
          return this.response.handlers.returnFirstRecord(records);
        }
      }
    });
  }
}

