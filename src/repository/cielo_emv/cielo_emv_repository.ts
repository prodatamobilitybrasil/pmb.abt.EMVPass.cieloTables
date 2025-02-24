import { Collection, ObjectId } from "mongodb";
import { ICieloEMV } from "../../entities/cielo_emv";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { INoSQLRepository } from "../no_sql_repository";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";

export class CieloEMVRepository implements INoSQLRepository<ICieloEMV> {
    private collection?: Collection<ICieloEMV>;
    constructor(private readonly mongo: MongoDB, private readonly exception: MongoDBException) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<ICieloEMV>("cieloEMV");
    }

    async insert(data: ICieloEMV[]): Promise<ObjectId | number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertMany(data);
            return result?.insertedCount;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "insert", data);
        }
    }
    
    async find(data?: ICieloEMV): Promise<ICieloEMV | ICieloEMV[] | undefined> {
        try {
            await this.init();
            const result = await this.collection?.find(data || {}).toArray();
            return result;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "find", {}, data);
        }
    }

    update(id: ObjectId, toUpdate: ICieloEMV): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }
    
    async delete(id?: ObjectId): Promise<number | undefined> {
        try {
            const result = await this.collection?.deleteMany(id ? { _id: id }: {});
            return result?.deletedCount;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "delete");
        }
    }
}
