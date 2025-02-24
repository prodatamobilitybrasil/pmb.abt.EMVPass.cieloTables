import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import { LogEMVRepository } from "../../../src/repository/log_emv/log_emv_repository.ts";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { log_emv_singleton } from "../../log_emv_singleton.ts";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception.ts";

dotenv.config();

describe("Teste Repository LogEMV", () => {

    const mongo = new MongoDB();
    const exception = new MongoDBException();
    mongo.connect();
    const repository = new LogEMVRepository(mongo, exception);
    var transaction_id : ObjectId | undefined = undefined;

    test("Teste Insert LogEMV", async () => {
        transaction_id = await repository.insert(log_emv_singleton);
        expect(transaction_id).toBeDefined();
    });

    mongo.disconnect();
});
