import { ConfigEMVRepository } from "../../repository/config_emv/config_emv_repository";
import { CieloTablesUpsertUsecase } from "../cielo_tables_upsert/cielo_tables_upsert";
import { InitializationVersion } from "../initialization_version/initialization_version";

export class CieloTablesInitUsecase {

    constructor(
        private readonly config_emv_repository: ConfigEMVRepository,
        private readonly cielo_tables_upsert: CieloTablesUpsertUsecase,
    ) {}

    async execute(): Promise<void> {
        try {
            const version = InitializationVersion.get();
            if (version === 0) {
                const config_emv = await this.config_emv_repository.find();
                if (config_emv?.InitializationVersion) InitializationVersion.set(config_emv.InitializationVersion);
                else await this.cielo_tables_upsert.execute();
            }
        } catch(err) {
            console.log("Error to init cielo tables!", err);
        }
    }
}
