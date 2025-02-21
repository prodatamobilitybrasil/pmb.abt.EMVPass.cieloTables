import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import { CieloTablesUpsertUsecase } from "../cielo_tables_upsert/cielo_tables_upsert";
import { InitializationVersion } from "../initialization_version/initialization_version";

export class CieloTablesInitUsecase {

    constructor(
        private readonly initialization_emv_repository: InitializationEMVRepository,
        private readonly cielo_tables_upsert: CieloTablesUpsertUsecase,
    ) {}

    async execute(): Promise<void> {
        try {
            const version = InitializationVersion.get();
            console.log(`${new Date().toISOString()} - Initialization Start - CurrentVersion: ${version}`);

            if (version === 0) {
                const config_emv = await this.initialization_emv_repository.find();
                console.log(`${new Date().toISOString()} - Initialization Start - DatabaseVersion: ${config_emv?.InitializationVersion}`);
                
                if (config_emv?.InitializationVersion) InitializationVersion.set(config_emv.InitializationVersion);
                else await this.cielo_tables_upsert.execute();
            }
        } catch(err) {
            console.log("Error to init cielo tables!", err);
        }
    }
}
