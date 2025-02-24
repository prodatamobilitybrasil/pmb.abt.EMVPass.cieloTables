import cielo_tables_init_usecase from "../../../src/usecases/cielo_tables_init/index";
import cielo_tables_upsert_usecase from "../../../src/usecases/cielo_tables_upsert";
import dotenv from "dotenv";
import { InitializationVersion } from "../../../src/usecases/initialization_version/initialization_version";
import { CieloAuthGateway } from "../../../src/gateways/cielo_auth/cielo_auth_gateway";
import { HttpException } from "../../../src/package/exception/http/http_exception";
import { InitializationEMVRepository } from "../../../src/repository/initialization_emv/initialization_emv_repository";
import { MongoDB } from "../../../src/infra/mongo_db/mongo_db";
import { MongoDBException } from "../../../src/package/exception/mongo_db/mongo_db_exception";
import { IInitializationEMV } from "../../../src/entities/initialization_emv";
import { CieloEMVRepository } from "../../../src/repository/cielo_emv/cielo_emv_repository";
import { CieloBinsRepository } from "../../../src/repository/cielo_bins/cielo_bins_repository";
import { CieloProductsRepository } from "../../../src/repository/cielo_products/cielo_products_repository";
import { ICieloEMV } from "../../../src/entities/cielo_emv";
import { ICieloBin } from "../../../src/entities/cielo_bin";
import { ICieloProduct } from "../../../src/entities/cielo_product";

dotenv.config();
describe("Teste Usecases Cielo Tables", () => {

    const gateway = new CieloAuthGateway(new HttpException());

    const mongo_db =new MongoDB();
    const mongo_exception = new MongoDBException();

    const initialization_emv_repository = new InitializationEMVRepository(mongo_db, mongo_exception);
    const emvs_repository = new CieloEMVRepository(mongo_db, mongo_exception);
    const bins_repository = new CieloBinsRepository(mongo_db, mongo_exception);
    const products_repository = new CieloProductsRepository(mongo_db, mongo_exception);

    const latestVersion = 1739301918964;

    test("Authorization Test", async () => await gateway.execute());

    test("Test Cielo Initialization Usecase", async () => {
        await cielo_tables_init_usecase.execute();
    });

    test("Test Update Cielo Tables - Empty version", async () => {
        await cielo_tables_upsert_usecase.execute();
    });

    test("Test Update Cielo Tables - With version", async () => {
        InitializationVersion.set(1739301918964);
        await cielo_tables_upsert_usecase.execute(latestVersion);
    });

    test("Test Update Cielo Tables - With version", async () => {
        InitializationVersion.set(1739301918963);
        await cielo_tables_upsert_usecase.execute(latestVersion);
    });

    test("Test Update Cielo Tables - With version", async () => {
        await initialization_emv_repository.delete();
        InitializationVersion.set(12345);
        InitializationVersion.setInProcess(12345);
        await cielo_tables_upsert_usecase.execute(latestVersion);
    });

    test("Test Update Cielo Tables - With version", async () => {
        await initialization_emv_repository.delete();
        await emvs_repository.delete();
        await bins_repository.delete();
        await products_repository.delete();
        
        InitializationVersion.set(12345);
        InitializationVersion.setInProcess(12345);
        await cielo_tables_upsert_usecase.execute(latestVersion);
    });

    test("Test Update Cielo Tables - With version", async () => {
        await initialization_emv_repository.delete();
        const emv = await emvs_repository.find() as ICieloEMV[];
        await emvs_repository.delete(emv[0]._id);
        const bins = await bins_repository.find() as ICieloBin[];
        await bins_repository.delete(bins[0]._id);
        const products = await products_repository.find() as ICieloProduct[];
        await products_repository.delete(products[0]._id);
        
        InitializationVersion.set(12345);
        InitializationVersion.setInProcess(12345);
        await cielo_tables_upsert_usecase.execute(latestVersion);
    });
});
