export default class Query {
  
  private statement:       string;
  private joinStatements:  string[];
  private whereStatements: string[];
  private orderStatements: string[];
  private limit:           number;
  private offset:          number;

  public constructor(statement: string) {
    this.statement = statement;
  }
  
  public addJoinStatement(statement: string): this {
    if (!this.joinStatements)
      this.joinStatements = [];
    this.joinStatements.push(statement);
    return this;
  }
  
  public addWhereStatement(statement: string): this {
    if (!this.whereStatements)
      this.whereStatements = [];
    this.whereStatements.push(statement);
    return this;
  }
  
  public addOrderStatement(statement: string): this {
    if (!this.orderStatements)
      this.orderStatements = [];
    this.orderStatements.push(statement);
    return this;
  }
  
  public setLimitOffset(limit: number, offset: number): this {
    this.limit  = limit;
    this.offset = offset;
    return this;
  }
  
  public toString(): string {
    let statement = this.statement;
    
    if (this.joinStatements && this.joinStatements.length > 0)
      statement += ' ' + this.joinStatements.join(' ');
      
    if (this.whereStatements && this.whereStatements.length > 0)
      return ' WHERE ' + this.whereStatements.join(' AND ');
      
    if (this.orderStatements && this.orderStatements.length > 0)
      return ' ORDER BY ' + this.orderStatements.join(', ');
      
    if (this.limit >= 0) {
      statement += ' LIMIT ' + this.limit;
      if (this.offset > 0)
        statement += ' OFFSET ' + this.offset;
    }
    else if (this.offset > 0)
      statement += ' LIMIT 18446744073709551615 OFFSET ' + this.offset;
  }
  
}

