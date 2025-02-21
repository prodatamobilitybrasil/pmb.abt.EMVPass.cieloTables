import { Collection, ObjectId } from "mongodb";
import { INoSQLRepository } from "../no_sql_repository";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { ICieloProduct } from "../../entities/cielo_product";

export class CieloProductsRepository implements INoSQLRepository<ICieloProduct> {
    private collection?: Collection<ICieloProduct>;
    constructor(private readonly mongo: MongoDB) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<ICieloProduct>("cieloProducts");
    }

    async insert(data: ICieloProduct[]): Promise<ObjectId | number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertMany(data);
            return result?.insertedCount;
        } catch(err) {
            console.log(`Error to insert data!\nData: ${data}\n${err}`);
        }
    }
    
    async find(data?: ICieloProduct): Promise<ICieloProduct | ICieloProduct[] | undefined> {
        try {
            await this.init();
            const result = await this.collection?.find(data ?? {}).toArray();
            return result;
        } catch(err) {
            console.log(`Error to find data!\nData: ${data}\n${err}`);
        }
    }

    update(id: ObjectId, toUpdate: ICieloProduct): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }

    async delete(): Promise<number | undefined> {
        try {
            const result = await this.collection?.deleteMany({});
            return result?.deletedCount;
        } catch(err) {
            console.log(`Error to delete data!\n${err}`);
        }
    }
}
