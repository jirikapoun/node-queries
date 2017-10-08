import { ServerResponse } from 'http';

interface EnhancedResponse extends ServerResponse {
  
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

interface ResponseHandlers {
  
    returnRecord(record: any): void;
    
    returnFirstRecord(records: any[]): void;

    returnRecords(records: any[]): void;
  
}

export { EnhancedResponse as default };