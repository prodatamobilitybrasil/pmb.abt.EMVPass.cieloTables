export interface IHttpException {
    handle(context: string, request: Request, response: Response): Promise<IHttpExceptionMessage>;
};

export interface IHttpExceptionMessage {
    context: string;
    status: number;
    statusText: string;
    response: any;
    request: {
        url: string;
        headers: any;
        body: any;
    };
}

export class HttpException implements IHttpException {
    async handle(context: string, request: Request, response: Response): Promise<IHttpExceptionMessage> {
        const requestBody = await request.text();
        const responseBody = await response.text();

        const exception: IHttpExceptionMessage = {
            context,
            status: response.status,
            statusText: response.statusText,
            response: responseBody !== "" ? JSON.parse(responseBody) : {},
            request: {
                url: request.url,
                headers: JSON.parse(JSON.stringify(Object.fromEntries(request.headers.entries()))),
                body: requestBody !== "" ? JSON.parse(requestBody) : {},
            },
        };

        console.log(`Http Request Error: ${context}\nStatus: ${exception.status} - ${exception.statusText}`);

        return exception;
    }
}
