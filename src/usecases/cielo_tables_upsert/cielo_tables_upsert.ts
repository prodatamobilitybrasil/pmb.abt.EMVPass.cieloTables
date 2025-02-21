import { ICieloBin } from "../../entities/cielo_bin";
import { ICieloEMV } from "../../entities/cielo_emv";
import { ICieloProduct } from "../../entities/cielo_product";
import { IInitializationEMV } from "../../entities/initialization_emv";
import { CieloTablesGateway } from "../../gateways/cielo_tables/cielo_tables_gateway";
import { CieloBinsRepository } from "../../repository/cielo_bins/cielo_bins_repository";
import { CieloEMVRepository } from "../../repository/cielo_emv/cielo_emv_repository";
import { CieloProductsRepository } from "../../repository/cielo_products/cielo_products_repository";
import { InitializationEMVRepository } from "../../repository/initialization_emv/initialization_emv_repository";
import { InitializationVersion } from "../initialization_version/initialization_version";

export class CieloTablesUpsertUsecase {
    constructor(
        private readonly cielo_emv_repository: CieloEMVRepository,
        private readonly cielo_bins_repository: CieloBinsRepository,
        private readonly cielo_products_repository: CieloProductsRepository,
        private readonly cielo_tables_gateway: CieloTablesGateway,
        private readonly initialization_emv_repository: InitializationEMVRepository,
    ) {}

    async execute(newVersion?: number): Promise<void> {

        console.log(`${new Date().toISOString()} - Update Version Start - NewVersion: ${newVersion}`);

        const currentInitializationVersion = InitializationVersion.get();
        const versionInProcess = InitializationVersion.getInProcess();

        console.log(`${new Date().toISOString()} - Update Version Start - CurrentVersion: ${currentInitializationVersion}`);
        console.log(`${new Date().toISOString()} - Update Version Start - VersionInProcess: ${versionInProcess}`);

        if (newVersion) {
            if (currentInitializationVersion === newVersion) throw new Error("Cielo tables version alreadly updated!");
            if (versionInProcess === newVersion) throw new Error("This version is already being updated!");

            InitializationVersion.setInProcess(newVersion);
        }

        const cieloResponse = await this.cielo_tables_gateway.execute();
        if (!cieloResponse) throw new Error(`Cielo Response is Empty!\nDATA: ${cieloResponse}`);

        console.log(`${new Date().toISOString()} - Update Version Start - CieloVersion: ${cieloResponse.InitializationVersion}`);

        if (!newVersion) {
            if (currentInitializationVersion === cieloResponse.InitializationVersion) throw new Error("Cielo tables alreadly updated!");

            InitializationVersion.setInProcess(cieloResponse.InitializationVersion);
        }

        const config_emv = await this.initialization_emv_repository.find();

        console.log(`${new Date().toISOString()} - Update Version Start - DatabaseVersion: ${config_emv?.InitializationVersion}`);

        if(config_emv?.InitializationVersion === cieloResponse.InitializationVersion) throw new Error("Cielo tables alreadly updated!");

        const { Emv, Bins, Products } = cieloResponse;

        var initializationEMV = {} as IInitializationEMV;

        const updateEmv = async () => {
            const currentEmvs = await this.cielo_emv_repository.find() as ICieloEMV[];
            console.log(`${new Date().toISOString()} - Update Version Start - EMVsInDatabase: ${currentEmvs.length} EMVsFromCielo: ${Emv.length}`);

            if (!currentEmvs.length) await this.cielo_emv_repository.insert(Emv);
            else if (currentEmvs.length < Emv.length) {
                const mapEmvs = new Map<number, ICieloEMV>();
                currentEmvs.forEach((value) => mapEmvs.set(value.Aid, value));

                for (let i = 0; i < Emv.length; i++) {
                    const emv = mapEmvs.get(Emv[i].Aid);
                    if (!emv) await this.cielo_emv_repository.insert([Emv[i]]);
                }
            }
            console.log(`${new Date().toISOString()} - Update Version Start - EMVsUpdateds: ${Emv.length - currentEmvs.length}`);
            initializationEMV.EmvsUpdated = Emv.length - currentEmvs.length;
        };

        const updateBins = async () => {
            const currentBins = await this.cielo_bins_repository.find() as ICieloBin[];
            console.log(`${new Date().toISOString()} - Update Version Start - BinsInDatabase: ${currentBins.length} BinsFromCielo: ${Bins.length}`);

            if (!currentBins.length) await this.cielo_bins_repository.insert(Bins);
            else if (currentBins.length < Bins.length) {
                const mapBins = new Map<string, ICieloBin>();
                currentBins.forEach((value) => mapBins.set(value.InitialBin + value.FinalBin, value));

                for (let i = 0; i < Bins.length; i++) {
                    const bin = mapBins.get(Bins[i].InitialBin + Bins[i].FinalBin);
                    if (!bin) await this.cielo_bins_repository.insert([Bins[i]]);
                }
            } 
            console.log(`${new Date().toISOString()} - Update Version Start - BinsUpdateds: ${Bins.length - currentBins.length}`);
            initializationEMV.BinsUpdated = Bins.length - currentBins.length;
        };

        const updateProducts = async () => {
            const currentProducts = await this.cielo_products_repository.find() as ICieloProduct[];
            console.log(`${new Date().toISOString()} - Update Version Start - ProductsInDatabase: ${currentProducts.length} ProductsFromCielo: ${Products.length}`);

            if (!currentProducts.length) await this.cielo_products_repository.insert(Products);
            else if (currentProducts.length < Products.length) {
                const mapProducts = new Map<number, ICieloProduct>();
                currentProducts.forEach((value) => mapProducts.set(value.ProductId, value));

                for (let i = 0; i < Products.length; i++) {
                    const product = mapProducts.get(Products[i].ProductId);
                    if (!product) await this.cielo_products_repository.insert([Products[i]]);
                }
            }
            console.log(`${new Date().toISOString()} - Update Version Start - ProductsUpdateds: ${Products.length - currentProducts.length}`);
            initializationEMV.ProductsUpdated = Products.length - currentProducts.length;
        };

        await updateEmv();
        await updateBins();
        await updateProducts();

        InitializationVersion.set(cieloResponse.InitializationVersion);
        initializationEMV.InitializationVersion = cieloResponse.InitializationVersion;
        initializationEMV.date = new Date();

        await this.initialization_emv_repository.insert(initializationEMV);
        console.log(`${new Date().toISOString()} - Update Version Start - Cielo Tables Updated With Success!`);
    }
}
