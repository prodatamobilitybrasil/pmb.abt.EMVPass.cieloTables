interface IUnxpectedException {
    handle(message: string, data: any): IUnxpectedExceptionMessage;
}

export interface IUnxpectedExceptionMessage {
    message: string;
    data?: any;
}

export class UnxpectedException implements IUnxpectedException {
    handle(message: string, data?: any): IUnxpectedExceptionMessage {
        const exception = {
            message,
            data
        } as IUnxpectedExceptionMessage;

        return exception;
    }
};
