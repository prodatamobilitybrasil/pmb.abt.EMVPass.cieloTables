import { IHttpExceptionMessage } from "../package/exception/http/http_exception";

export interface IGateway<T> {
    execute(body?: any): Promise<T | IHttpExceptionMessage>;
};
