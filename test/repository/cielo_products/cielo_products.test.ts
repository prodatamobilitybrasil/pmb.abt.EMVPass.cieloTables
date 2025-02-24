import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import dotenv from "dotenv";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception.ts";
import { CieloProductsRepository } from "../../../src/repository/cielo_products/cielo_products_repository.ts"
import { ICieloProduct } from "../../../src/entities/cielo_product.ts";
import { cielo_products_singleton } from "../../cielo_product_singleton.ts";

dotenv.config();

describe("Teste Repository CieloProducts", () => {

    const mongo = new MongoDB();
    mongo.connect();
    const exception = new MongoDBException();
    
    const repository = new CieloProductsRepository(mongo, exception);

    test("Teste Insert CieloProducts", async () => {
        const count = await repository.insert([cielo_products_singleton]);
        expect(count).toBe(1);
    });

    test("Teste Find CieloProducts", async () => {
        const result = await repository.find(cielo_products_singleton) as ICieloProduct[];
        expect(result[0].ProductId).toBe(cielo_products_singleton.ProductId);
    });

    test("Teste Delete CieloProducts", async () => {
        const result = await repository.delete();
        expect(result).toBe(1);
    });

    mongo.disconnect();
});
