import { Log } from "../../package/exception/logger/logger";
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
            Log("Cielo Tables Initialization", `Start - CurrentVersion: ${version}`);

            if (version === 0) {
                const initialization_emv = await this.initialization_emv_repository.find();
                
                if (initialization_emv?.InitializationVersion) {
                    InitializationVersion.set(initialization_emv.InitializationVersion);
                    Log("Cielo Tables Initialization", `DatabaseVersion: ${initialization_emv?.InitializationVersion} is Current!`);
                }
                else await this.cielo_tables_upsert.execute();
            }
        } catch(err) {
            Log("Cielo Tables Initialization", `${err}`);
        }
    }
}
