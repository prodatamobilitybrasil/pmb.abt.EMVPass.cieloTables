import { CieloTablesGateway } from "../../gateways/cielo_tables/cielo_tables_gateway";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { CieloBinsRepository } from "../../repository/cielo_bins/cielo_bins_repository";
import { CieloEMVRepository } from "../../repository/cielo_emv/cielo_emv_repository";
import { CieloProductsRepository } from "../../repository/cielo_products/cielo_products_repository";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import { CieloTablesUpsertUsecase } from "./cielo_tables_upsert";


const mongo_db = new MongoDB();
const cielo_emv_repository = new CieloEMVRepository(mongo_db);
const cielo_bins_repository = new CieloBinsRepository(mongo_db);
const cielo_products_repository = new CieloProductsRepository(mongo_db);
const cielo_tables_gateway = new CieloTablesGateway();
const config_emv_repository = new InitializationEMVRepository(mongo_db);


const cielo_tables_upsert_usecase = new CieloTablesUpsertUsecase(
    cielo_emv_repository,
    cielo_bins_repository,
    cielo_products_repository,
    cielo_tables_gateway,
    config_emv_repository,
);

export default cielo_tables_upsert_usecase;
