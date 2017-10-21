interface IResponseHandlers {
  
    returnRecord(record: any): void;
    
    returnFirstRecord(records: any[]): void;

    returnRecords(records: any[]): void;
  
}

export { IResponseHandlers as default };