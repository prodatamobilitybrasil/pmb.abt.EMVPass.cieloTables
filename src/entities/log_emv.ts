import { ObjectId } from "mongodb";
import { IHttpExceptionMessage } from "../package/exception/http/http_exception";

export interface ILogEMV extends Document {
    _id?: ObjectId;
    service: string;
    message: string;
    error: IHttpExceptionMessage | any;
    date: Date;
}
