import { Observable } from 'rxjs';

interface ICheck {
  
  check(whereStatements: string[]): Observable<boolean>;
  
}

export { ICheck as default };