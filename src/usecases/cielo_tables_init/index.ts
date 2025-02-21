import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import cielo_tables_upsert_usecase from "../cielo_tables_upsert";
import { CieloTablesInitUsecase } from "./cielo_tables_init";

const mongo_db = new MongoDB();
const initialization_emv_repository = new InitializationEMVRepository(mongo_db);
const cielo_tables_init_usecase = new CieloTablesInitUsecase(initialization_emv_repository, cielo_tables_upsert_usecase);

export default cielo_tables_init_usecase;
