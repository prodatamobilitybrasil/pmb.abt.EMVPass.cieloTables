import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import dotenv from "dotenv";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception.ts";
import { CieloEMVRepository } from "../../../src/repository/cielo_emv/cielo_emv_repository.ts"
import { cielo_emv_singleton } from "../../cielo_emv_singleton.ts";
import { ICieloEMV } from "../../../src/entities/cielo_emv.ts";

dotenv.config();

describe("Teste Repository CieloEMVs", () => {

    const mongo = new MongoDB();
    mongo.connect();
    const exception = new MongoDBException();
    
    const repository = new CieloEMVRepository(mongo, exception);

    test("Teste Insert CieloEMVs", async () => {
        const count = await repository.insert([cielo_emv_singleton]);
        expect(count).toBe(1);
    });

    test("Teste Find CieloEMVs", async () => {
        const result = await repository.find(cielo_emv_singleton) as ICieloEMV[];
        expect(result[0].Aid).toBe(cielo_emv_singleton.Aid);
    });

    test("Teste Delete CieloEMVs", async () => {
        const result = await repository.delete();
        expect(result).toBe(1);
    });

    mongo.disconnect();
});
