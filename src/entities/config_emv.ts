import { ObjectId } from "mongodb";

export interface IConfigEMV extends Document {
    _id?: ObjectId;
    InitializationVersion: number;
}
