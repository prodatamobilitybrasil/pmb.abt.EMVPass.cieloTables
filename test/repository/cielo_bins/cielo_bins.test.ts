import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import dotenv from "dotenv";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception.ts";
import { CieloBinsRepository } from "../../../src/repository/cielo_bins/cielo_bins_repository.ts"
import { cielo_bins_singleton } from "../../cielo_bins_singleton.ts";
import { ICieloBin } from "../../../src/entities/cielo_bin.ts";

dotenv.config();

describe("Teste Repository CieloBins", () => {

    const mongo = new MongoDB();
    mongo.connect();
    const exception = new MongoDBException();
    
    const repository = new CieloBinsRepository(mongo, exception);

    test("Teste Insert CieloBins", async () => {
        const count = await repository.insert([cielo_bins_singleton]);
        expect(count).toBe(1);
    });

    test("Teste Find CieloBins", async () => {
        const result = await repository.find(cielo_bins_singleton) as ICieloBin[];
        expect(result[0].InitialBin).toBe(cielo_bins_singleton.InitialBin);
    });

    test("Teste Delete CieloBins", async () => {
        const result = await repository.delete();
        expect(result).toBeDefined();
    });

    mongo.disconnect();
});
