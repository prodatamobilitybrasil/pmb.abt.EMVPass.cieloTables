import { ICieloBin } from "../../entities/cielo_bin";
import { ICieloEMV } from "../../entities/cielo_emv";
import { ICieloProduct } from "../../entities/cielo_product";
import { IInitializationEMV } from "../../entities/initialization_emv";
import { ILogEMV } from "../../entities/log_emv";
import { CieloTablesGateway } from "../../gateways/cielo_tables/cielo_tables_gateway";
import { IHttpExceptionMessage } from "../../package/exception/http/http_exception";
import { Log } from "../../package/exception/logger/logger";
import { IMongoDBExceptionMessage } from "../../package/exception/mongo_db/mongo_db_exception";
import { IUnxpectedExceptionMessage, UnxpectedException } from "../../package/exception/unxpected/unxpected_exception";
import { CieloBinsRepository } from "../../repository/cielo_bins/cielo_bins_repository";
import { CieloEMVRepository } from "../../repository/cielo_emv/cielo_emv_repository";
import { CieloProductsRepository } from "../../repository/cielo_products/cielo_products_repository";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import { LogEMVRepository } from "../../repository/log_emv/log_emv_repository";
import { InitializationVersion } from "../initialization_version/initialization_version";

export class CieloTablesUpsertUsecase {
    constructor(
        private readonly cielo_emv_repository: CieloEMVRepository,
        private readonly cielo_bins_repository: CieloBinsRepository,
        private readonly cielo_products_repository: CieloProductsRepository,
        private readonly cielo_tables_gateway: CieloTablesGateway,
        private readonly initialization_emv_repository: InitializationEMVRepository,
        private readonly repository_log_emv: LogEMVRepository,
        private readonly unxpected_exception: UnxpectedException,
    ) {}

    async execute(newVersion?: number): Promise<void> {
        try {
            const currentInitializationVersion = InitializationVersion.get();
            const versionInProcess = InitializationVersion.getInProcess();
    
            Log("Update Cielo Tables", `CurrentVersion: ${currentInitializationVersion}`);
            Log("Update Cielo Tables", `VersionInProcess: ${versionInProcess}`);
    
            if (newVersion) {
                if (currentInitializationVersion === newVersion)
                    throw this.unxpected_exception.handle("Cielo tables version alreadly updated!", {current: currentInitializationVersion, new: newVersion});
                
                if (versionInProcess === newVersion)
                    throw this.unxpected_exception.handle("This version is already being updated!", {inProccess: versionInProcess, new: newVersion});
    
                InitializationVersion.setInProcess(newVersion);
            }
    
            const cieloResponse = await this.cielo_tables_gateway.execute();
            if ("statusText" in cieloResponse) throw cieloResponse;
    
            Log("Update Cielo Tables", `CieloVersion: ${cieloResponse.InitializationVersion}`);
    
            if (!newVersion) {
                if (currentInitializationVersion === cieloResponse.InitializationVersion)
                    throw this.unxpected_exception.handle("Cielo tables alreadly updated!", { current: currentInitializationVersion, cieloVersion: cieloResponse.InitializationVersion });
                
                InitializationVersion.setInProcess(cieloResponse.InitializationVersion);
            }
    
            const initialization_emv = await this.initialization_emv_repository.find();
    
            Log("Update Cielo Tables", `DatabaseVersion: ${initialization_emv?.InitializationVersion}`);
    
            if(initialization_emv?.InitializationVersion === cieloResponse.InitializationVersion)
                throw this.unxpected_exception.handle("Cielo tables alreadly updated!", { databaseVersion: initialization_emv.InitializationVersion, cieloVersion: cieloResponse.InitializationVersion });
    
            const { Emv, Bins, Products } = cieloResponse;

            console.log("EMV: ", Emv[0]);
            console.log("BINS: ", Bins[0]);
            console.log("PRODUCTS: ", Products[0]);
    
            var initializationEMV = {} as IInitializationEMV;
    
            const updateEmv = async () => {
                const currentEmvs = await this.cielo_emv_repository.find() as ICieloEMV[];
                Log("Update Cielo Tables", `EMVsInDatabase: ${currentEmvs.length} EMVsFromCielo: ${Emv.length}`);
    
                if (!currentEmvs.length) await this.cielo_emv_repository.insert(Emv);
                else if (currentEmvs.length < Emv.length) {
                    const mapEmvs = new Map<number, ICieloEMV>();
                    currentEmvs.forEach((value) => mapEmvs.set(value.Aid, value));
    
                    for (let i = 0; i < Emv.length; i++) {
                        const emv = mapEmvs.get(Emv[i].Aid);
                        if (!emv) await this.cielo_emv_repository.insert([Emv[i]]);
                    }
                }
                Log("Update Cielo Tables", `EMVsUpdateds: ${Emv.length - currentEmvs.length}`);
                initializationEMV.EmvsUpdated = Emv.length - currentEmvs.length;
            };
    
            const updateBins = async () => {
                const currentBins = await this.cielo_bins_repository.find() as ICieloBin[];
                Log("Update Cielo Tables", `BinsInDatabase: ${currentBins.length} BinsFromCielo: ${Bins.length}`);
    
                if (!currentBins.length) await this.cielo_bins_repository.insert(Bins);
                else if (currentBins.length < Bins.length) {
                    const mapBins = new Map<string, ICieloBin>();
                    currentBins.forEach((value) => mapBins.set(value.InitialBin + value.FinalBin, value));
    
                    for (let i = 0; i < Bins.length; i++) {
                        const bin = mapBins.get(Bins[i].InitialBin + Bins[i].FinalBin);
                        if (!bin) await this.cielo_bins_repository.insert([Bins[i]]);
                    }
                } 
                Log("Update Cielo Tables", `BinsUpdateds: ${Bins.length - currentBins.length}`);
                initializationEMV.BinsUpdated = Bins.length - currentBins.length;
            };
    
            const updateProducts = async () => {
                const currentProducts = await this.cielo_products_repository.find() as ICieloProduct[];
                Log("Update Cielo Tables", `ProductsInDatabase: ${currentProducts.length} ProductsFromCielo: ${Products.length}`);
    
                if (!currentProducts.length) await this.cielo_products_repository.insert(Products);
                else if (currentProducts.length < Products.length) {
                    const mapProducts = new Map<number, ICieloProduct>();
                    currentProducts.forEach((value) => mapProducts.set(value.ProductId, value));
    
                    for (let i = 0; i < Products.length; i++) {
                        const product = mapProducts.get(Products[i].ProductId);
                        if (!product) await this.cielo_products_repository.insert([Products[i]]);
                    }
                }
                Log("Update Cielo Tables", `ProductsUpdateds: ${Products.length - currentProducts.length}`);
                initializationEMV.ProductsUpdated = Products.length - currentProducts.length;
            };
    
            await updateEmv();
            await updateBins();
            await updateProducts();
    
            InitializationVersion.set(cieloResponse.InitializationVersion);
            initializationEMV.InitializationVersion = cieloResponse.InitializationVersion;
            initializationEMV.date = new Date();
    
            await this.initialization_emv_repository.insert(initializationEMV);
            Log("Update Cielo Tables", `Cielo Tables Updated With Success!`);
        } catch(err) {
            var message: string = "Process Transaction Error";

            if (err instanceof Error) message = err.message;

            if (message === "Process Transaction Error") {
                const httpException = err as IHttpExceptionMessage;
                if (httpException.context) message =  `Error in ${httpException.context}`;
            }

            if (message === "Process Transaction Error") {
                const unxpectedException = err as IUnxpectedExceptionMessage;
                if (unxpectedException.message) message =  `Unxpected Exception: ${unxpectedException.message}`;
            }

            if (message === "Process Transaction Error") {
                const mongoDBException = err as IMongoDBExceptionMessage;
                if (mongoDBException.collection) message =  `MongoDB Exception: ${mongoDBException.operation} ${mongoDBException.collection}`;
            }

            const logEMV = {
                service: "CieloTrablesService",
                message,
                error: err,
                date: new Date(),
            } as ILogEMV;

            await this.repository_log_emv.insert(logEMV);
            Log("Update Cielo Tables", `${err}`);
        }
    }
}
