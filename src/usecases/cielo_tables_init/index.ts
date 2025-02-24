import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { MongoDBException } from "../../package/exception/mongo_db/mongo_db_exception";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import cielo_tables_upsert_usecase from "../cielo_tables_upsert";
import { CieloTablesInitUsecase } from "./cielo_tables_init";

const mongo_db = new MongoDB();
const mongo_db_exception = new MongoDBException();
const initialization_emv_repository = new InitializationEMVRepository(mongo_db, mongo_db_exception);
const cielo_tables_init_usecase = new CieloTablesInitUsecase(initialization_emv_repository, cielo_tables_upsert_usecase);

export default cielo_tables_init_usecase;
