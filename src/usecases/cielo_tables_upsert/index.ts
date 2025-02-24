import { CieloTablesGateway } from "../../gateways/cielo_tables/cielo_tables_gateway";
import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { HttpException } from "../../package/exception/http/http_exception";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";
import { UnxpectedException } from "../../package/exception/unxpected/unxpected_exception";
import { CieloBinsRepository } from "../../repository/cielo_bins/cielo_bins_repository";
import { CieloEMVRepository } from "../../repository/cielo_emv/cielo_emv_repository";
import { CieloProductsRepository } from "../../repository/cielo_products/cielo_products_repository";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import { LogEMVRepository } from "../../repository/log_emv/log_emv_repository";
import { CieloTablesUpsertUsecase } from "./cielo_tables_upsert";

const mongo_db = new MongoDB();

const mongo_exception = new MongoDBException();
const http_exception = new HttpException();
const unxpected_exception = new UnxpectedException();

const cielo_emv_repository = new CieloEMVRepository(mongo_db, mongo_exception);
const cielo_bins_repository = new CieloBinsRepository(mongo_db, mongo_exception);
const cielo_products_repository = new CieloProductsRepository(mongo_db, mongo_exception);
const cielo_tables_gateway = new CieloTablesGateway(http_exception);
const initialization_emv_repository = new InitializationEMVRepository(mongo_db, mongo_exception);
const log_emv_repository = new LogEMVRepository(mongo_db, mongo_exception);

const cielo_tables_upsert_usecase = new CieloTablesUpsertUsecase(
    cielo_emv_repository,
    cielo_bins_repository,
    cielo_products_repository,
    cielo_tables_gateway,
    initialization_emv_repository,
    log_emv_repository,
    unxpected_exception,
);

export default cielo_tables_upsert_usecase;
