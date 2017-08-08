import * as mysql from 'mysql2';

var connection = mysql.createConnection({
  host:     "vps.jkapoun.cz",
  port:      3306,
  user:     "recepty",
  password: "iUW$A916K8",
  database: "recepty"
});

export default class SelectHandler {
  
  private response: any;
  private table:    string;

  private joinStatement: string;
  private joinValues:    any[];

  private whereStatements: string[];
  private whereValues:     any[];
  
  private orderStatements: string[];
  private orderValues:     string[];
  
  private limit:  number;
  private offset: number;
  
  private callback : (record: any) => void;
  
  public constructor(response: any, table: string) {
    this.response        = response;
    this.table           = table;
    this.joinStatement   = '';
    this.joinValues      = [];
    this.whereStatements = [];
    this.whereValues     = [];
    this.orderStatements = [];
    this.orderValues     = [];
  }
  
  public joinUsing(table, column) {
    this.joinStatement += ' JOIN ?? USING (??)';
    this.joinValues.push(table, column);
  }

  public where(fieldsAndValues: any) : this {
    for (let key in fieldsAndValues) {
      let value = fieldsAndValues[key];
      this.whereStatements.push('?? = ?');
      this.whereValues    .push(key, value);
    }
    return this;
  }

  public whereAny(fieldsAndValues: any) : this {
    let subStatements = [];
    for (let key in fieldsAndValues) {
      let value = fieldsAndValues[key];
      subStatements.push('?? = ?');
      this.whereValues.push(key, value);
    }
    let statement = subStatements.join(' OR ');
    this.whereStatements.push(`( ${statement} )`);
    return this;
  }

  public whereIn(fieldsAndValues: any) : this {
    for (let key in fieldsAndValues) {
      let values = fieldsAndValues[key];
      if (values) {
        this.whereStatements.push('?? IN (?)');
        this.whereValues    .push(key, values);
      }
    }
    return this;
  }
  
  public whereLike(fieldsAndValues: any) : this {
    for (let key in fieldsAndValues) {
      let value = fieldsAndValues[key];
      if (value) {
        this.whereStatements.push("?? LIKE CONCAT('%', ?, '%')");
        this.whereValues    .push(key, value);
      }
    }
    return this;
  }
  
  public orderBy(column: string, ascOrDesc: string) : this { /** @todo enum? */
    if (!ascOrDesc)
      ascOrDesc = 'ASC';
    this.orderStatements.push(`?? ${ascOrDesc}`);
    this.orderValues    .push(column);
    return this;
  }
  
  public limitOffset(limit: number, offset: number): this {
    this.limit  = limit;
    this.offset = offset;
    return this;
  }
  
  public postprocess(callback: (record: any) => void) : this {
    this.callback = callback;
    return this;
  }
  
  public execute() : void {
    let statement: string = 'SELECT ??.* FROM ??';
    let values:    any[]  = [ this.table, this.table ];
    
    if (this.joinStatement) {
      statement += this.joinStatement;
      Array.prototype.push.apply(values, this.joinValues);
    }
    
    if (this.whereStatements) {
      statement += ' WHERE ' + this.whereStatements.join(' AND ');
      Array.prototype.push.apply(values, this.whereValues);
    }
    
    if (this.orderStatements) {
      statement += ' ORDER BY ' + this.orderStatements.join(', ');
      Array.prototype.push.apply(values, this.orderValues);
    }
    
    if (this.limit >= 0) {
      statement += ' LIMIT ?';
      values.push(this.limit);
      
      if (this.offset > 0) {
        statement += ' OFFSET ?';
        values.push(this.offset);
      }
    }
    else if (this.offset > 0) {
      statement += ' LIMIT 18446744073709551615 OFFSET ?';
      values.push(this.offset);
    }
    
    connection.query(statement, values, (error : any, records : any[]) => {
      if (error) {
        let sql = mysql.format(statement, values);
        console.error(error);
        console.trace('Query failed: ' + sql);
        return this.response.internalServerError();
      }
      else {
        if (this.callback) {
          try {
            for (let i = 0; i < records.length; i++)
              this.callback(records[i]);
            return this.response.handlers.returnRecords(records);
          }
          catch (e) {
            console.trace(e);
            return this.response.internalServerError();
          }
        }
        else {
          return this.response.handlers.returnRecords(records);
        }
      }
    });
  }
}

