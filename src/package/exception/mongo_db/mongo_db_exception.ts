interface IMongoDBException {
    handle(collection: string, operation: string, data: any, filter?: any): IMongoDBExceptionMessage;
}

export interface IMongoDBExceptionMessage {
    collection: string;
    operation: string;
    data?: any;
    filter?: any;
}

export class MongoDBException implements IMongoDBException {
    handle(collection: string, operation: string, data?: any, filter?: any): IMongoDBExceptionMessage {
        const exception = {
            collection,
            operation,
            data,
            filter,
        } as IMongoDBExceptionMessage;

        return exception;
    }
};
