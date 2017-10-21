import * as mysql             from 'mysql2';
import {Observable, Observer} from 'rxjs';
import db                     from '../../db';
import ICheck                 from '../../interfaces/check';

export default class SimpleCheck implements ICheck {
  
  private statement:     string;
  private expectedValue: any;
  
  public constructor(table: string, column: string, value: any) {
    this.statement = mysql.format(
      'SELECT ?? AS "value" FROM ??',
      [ column, table ]
    );
    this.expectedValue = value;
  }
  
  public check(whereStatements: string[]): Observable<boolean> {
    let statement = this.statement;    
    if (whereStatements && whereStatements.length > 0)
      statement += ' WHERE ' + whereStatements.join(' AND ');
    
    return Observable.create((observer: Observer<boolean>) => {
      db.query(statement, (error, rows: any[]) => {
        if (error) {
          observer.error(error);
        }
        else if (rows.length > 0) {
          var equals = true;
          for (let row of rows) {
            let value = row['value'];
            if (value !== this.expectedValue) {
              equals = false;
              break;
            }
          }
          observer.next(equals);
        }
        else
          observer.next(null);
        
        observer.complete();
      });
    });
  }
  
}
