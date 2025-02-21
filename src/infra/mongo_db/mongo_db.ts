import { Collection, Db, MongoClient } from "mongodb";

interface IMongoDB {
    connect(): Promise<void> ;
    disconnect(): Promise<void>;
    collection<T extends Document>(name: string): Promise<Collection<T>>;
}

export class MongoDB implements IMongoDB {
    static instance?: MongoClient;
    private static database: Db;
    
    async connect(): Promise<void> {
        const connStr = process.env.MONGO_CONN_STR || "";
        const dbName = process.env.MONGO_DB_NAME || "";
        try {
            MongoDB.instance = await new MongoClient(connStr).connect();
            MongoDB.database = MongoDB.instance.db(dbName);
            console.log("Connected to MongoDB with Success!")
        } catch(err) {
            console.log("Error to connect MongoDB!\nERROR: ", err);
        }
    }

    async disconnect(): Promise<void> {
        try {
            await MongoDB.instance?.close();
            console.log("Disconnected to MongoDB with Success!")
        } catch(err) {
            console.log("Error to disconnect MongoDB!\nERROR: ", err);
        }
    }

    async collection<T extends Document>(name: string): Promise<Collection<T>> {
        if (!MongoDB.instance) await this.connect();
        return MongoDB.database.collection<T>(name);
    }
}
