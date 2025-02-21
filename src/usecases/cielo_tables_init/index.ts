import { MongoDB } from "../../infra/mongo_db/mongo_db";
import { ConfigEMVRepository } from "../../repository/config_emv/config_emv_repository";
import cielo_tables_upsert_usecase from "../cielo_tables_upsert";
import { CieloTablesInitUsecase } from "./cielo_tables_init";

const mongo_db = new MongoDB();
const config_emv_repository = new ConfigEMVRepository(mongo_db);
const cielo_tables_init_usecase = new CieloTablesInitUsecase(config_emv_repository, cielo_tables_upsert_usecase);

export default cielo_tables_init_usecase;
