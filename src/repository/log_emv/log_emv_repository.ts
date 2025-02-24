import { Collection, ObjectId } from "mongodb";
import { INoSQLRepository } from "../no_sql_repository";
import { ILogEMV } from "../../entities/log_emv";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";


export class LogEMVRepository implements INoSQLRepository<ILogEMV> {
    private collection?: Collection<ILogEMV>;
    constructor(private readonly mongo: MongoDB, private readonly exception: MongoDBException) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<ILogEMV>("logEMV");
    }

    async insert(data: ILogEMV): Promise<ObjectId | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertOne(data);
            return result?.insertedId!;
        } catch(err) {
            throw this.exception.handle(this.collection?.collectionName!, "insert", data);
        }
    }

    find(data: ILogEMV): Promise<ILogEMV | ILogEMV[] | undefined> {
        throw new Error("Method not implemented.");
    }
    update(id: ObjectId, toUpdate: ILogEMV): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }
    delete(id: ObjectId): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }
}