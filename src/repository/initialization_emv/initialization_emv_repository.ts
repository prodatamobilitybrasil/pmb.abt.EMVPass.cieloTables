import { Collection, ObjectId } from "mongodb";
import { INoSQLRepository } from "../no_sql_repository";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { IInitializationEMV } from "../../entities/initialization_emv";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";

export class InitializationEMVRepository implements INoSQLRepository<IInitializationEMV> {
    private collection?: Collection<IInitializationEMV>;
    constructor(private readonly mongo: MongoDB, private readonly exception: MongoDBException) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<IInitializationEMV>("initializationEMV");
    }

    async insert(data: IInitializationEMV): Promise<ObjectId | number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertOne(data);
            return result?.insertedId;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "insert", data);
        }
    }
    
    async find(): Promise<IInitializationEMV | null | undefined> {
        try {
            await this.init();
            const result = await this.collection?.find().sort({ date: -1 }).limit(1).toArray();
            return result![0];
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "find");
        }
    }

    async update(id: ObjectId, toUpdate: IInitializationEMV): Promise<number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.updateOne({ _id: id }, { $set: { ...toUpdate } });
            return result?.modifiedCount;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "update", id, toUpdate);
        }
    }

    delete(id: ObjectId): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }
}
