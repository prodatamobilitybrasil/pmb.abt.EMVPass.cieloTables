import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import dotenv from "dotenv";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception.ts";
import { InitializationEMVRepository } from "../../../src/repository/initialization_emv/initialization_emv_repository.ts"
import { IInitializationEMV } from "../../../src/entities/initialization_emv.ts";
import { initialization_emv_singleton } from "../../initialization_emv_singleton.ts";

dotenv.config();

describe("Teste Repository InitializationEMV", () => {

    const mongo = new MongoDB();
    mongo.connect();
    const exception = new MongoDBException();
    
    const repository = new InitializationEMVRepository(mongo, exception);

    test("Teste Insert InitializationEMV", async () => {
        const result = await repository.insert(initialization_emv_singleton);
        expect(result).toBeDefined();
    });

    test("Teste Find InitializationEMV", async () => {
        const result = await repository.find();
        expect(result?.InitializationVersion).toBe(initialization_emv_singleton.InitializationVersion);
    });

    test("Teste Update InitializationEMV", async () => {
        const data = await repository.find() as IInitializationEMV;

        const result = await repository.update(data._id!, { InitializationVersion: 123456789101112 } as IInitializationEMV);
        expect(result).toBeDefined();
    });

    test("Teste Delete InitializationEMV", async () => {
        const result = await repository.delete();
        expect(result).toBeDefined();
    });

    mongo.disconnect();
});
