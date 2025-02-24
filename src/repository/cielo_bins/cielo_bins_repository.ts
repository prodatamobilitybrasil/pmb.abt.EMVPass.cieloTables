import { Collection, ObjectId } from "mongodb";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { INoSQLRepository } from "../no_sql_repository";
import { ICieloBin } from "../../entities/cielo_bin";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";

export class CieloBinsRepository implements INoSQLRepository<ICieloBin> {
    private collection?: Collection<ICieloBin>;
    constructor(private readonly mongo: MongoDB, private readonly exception: MongoDBException) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<ICieloBin>("cieloBins");
    }

    async insert(data: ICieloBin[]): Promise<ObjectId | number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertMany(data);
            return result?.insertedCount;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "insert", data);
        }
    }
    
    async find(data?: ICieloBin): Promise<ICieloBin | ICieloBin[] | undefined> {
        try {
            await this.init();
            const result = await this.collection?.find(data || {}).toArray();
            return result;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "find", {}, data);
        }
    }

    update(id: ObjectId, toUpdate: ICieloBin): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }
    
    async delete(): Promise<number | undefined> {
        try {
            const result = await this.collection?.deleteMany({});
            return result?.deletedCount;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "delete");
        }
    }
}
