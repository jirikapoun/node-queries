import {ServerResponse} from 'http';
import ResponseHandlers from './response-handlers';

interface IEnhancedResponse extends ServerResponse {
  
  handlers: ResponseHandlers;
  
  ok(data: any, contentType: string): void;
  
  created(location: string): void;
  
  noContent(): void;
  
  badRequest(message?: string): void;
  
  unauthorized(message?: string): void;
  
  forbidden(): void;
  
  notFound(): void;
  
  internalServerError(): void;
  
  createInsertHandler(location: string): (records: any[]) => void;
  
  createUpdateHandler(): (records: any[]) => void;
  
  createDeleteHandler():(records: any[]) =>  void;
  
}

export { IEnhancedResponse as default };