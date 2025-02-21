import { ObjectId } from "mongodb";

export interface IInitializationEMV extends Document {
    _id?: ObjectId;
    InitializationVersion: number;
    EmvsUpdated: number;
    BinsUpdated: number;
    ProductsUpdated: number;
    date: Date;
}
