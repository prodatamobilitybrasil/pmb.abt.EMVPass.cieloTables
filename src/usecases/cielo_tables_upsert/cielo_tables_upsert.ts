import { ICieloBin } from "../../entities/cielo_bin";
import { ICieloEMV } from "../../entities/cielo_emv";
import { ICieloProduct } from "../../entities/cielo_product";
import { IConfigEMV } from "../../entities/config_emv";
import { CieloTablesGateway } from "../../gateways/cielo_tables/cielo_tables_gateway";
import { CieloBinsRepository } from "../../repository/cielo_bins/cielo_bins_repository";
import { CieloEMVRepository } from "../../repository/cielo_emv/cielo_emv_repository";
import { CieloProductsRepository } from "../../repository/cielo_products/cielo_products_repository";
import { ConfigEMVRepository } from "../../repository/config_emv/config_emv_repository";
import { InitializationVersion } from "../initialization_version/initialization_version";

export class CieloTablesUpsertUsecase {
    constructor(
        private readonly cielo_emv_repository: CieloEMVRepository,
        private readonly cielo_bins_repository: CieloBinsRepository,
        private readonly cielo_products_repository: CieloProductsRepository,
        private readonly cielo_tables_gateway: CieloTablesGateway,
        private readonly config_emv_repository: ConfigEMVRepository,
    ) {}

    async execute(newVersion?: number): Promise<void> {

        const currentInitializationVersion = InitializationVersion.get();
        const versionInProcess = InitializationVersion.getInProcess();

        if (newVersion) {
            if (currentInitializationVersion === newVersion) throw new Error("Cielo tables version alreadly updated!");
            if (versionInProcess === newVersion) throw new Error("This version is already being updated!");

            InitializationVersion.setInProcess(newVersion);
        }

        const cieloResponse = await this.cielo_tables_gateway.execute();
        if (!cieloResponse) throw new Error(`Cielo Response is Empty!\nDATA: ${cieloResponse}`);

        if (!newVersion) {
            if (currentInitializationVersion === cieloResponse.InitializationVersion) throw new Error("Cielo tables alreadly updated!");

            InitializationVersion.setInProcess(cieloResponse.InitializationVersion);
        }

        const config_emv = await this.config_emv_repository.find();
        if(config_emv?.InitializationVersion === cieloResponse.InitializationVersion) throw new Error("Cielo tables alreadly updated!");

        const { Emv, Bins, Products } = cieloResponse;

        console.log("EMV: ", Emv.length, "Bins: ", Bins.length, "Products: ", Products.length);

        const updateEmv = async () => {
            const currentEmvs = await this.cielo_emv_repository.find() as ICieloEMV[];
            if (!currentEmvs.length) await this.cielo_emv_repository.insert(Emv);
            else if (currentEmvs.length < Emv.length) {
                const mapEmvs = new Map<number, ICieloEMV>();
                currentEmvs.forEach((value) => mapEmvs.set(value.Aid, value));

                for (let i = 0; i < Emv.length; i++) {
                    const emv = mapEmvs.get(Emv[i].Aid);
                    if (!emv) await this.cielo_emv_repository.insert([Emv[i]]);
                }
            }
            console.log("EMV UPDATED");
        };

        const updateBins = async () => {
            const currentBins = await this.cielo_bins_repository.find() as ICieloBin[];
            if (!currentBins.length) await this.cielo_bins_repository.insert(Bins);
            else if (currentBins.length < Bins.length) {
                const mapBins = new Map<string, ICieloBin>();
                currentBins.forEach((value) => mapBins.set(value.InitialBin + value.FinalBin, value));

                for (let i = 0; i < Bins.length; i++) {
                    const bin = mapBins.get(Bins[i].InitialBin + Bins[i].FinalBin);
                    if (!bin) await this.cielo_bins_repository.insert([Bins[i]]);
                }
            } 
            console.log("BINS UPDATED");
        };

        const updateProducts = async () => {
            const currentProducts = await this.cielo_products_repository.find() as ICieloProduct[];
            if (!currentProducts.length) await this.cielo_products_repository.insert(Products);
            else if (currentProducts.length < Products.length) {
                const mapProducts = new Map<number, ICieloProduct>();
                currentProducts.forEach((value) => mapProducts.set(value.ProductId, value));

                for (let i = 0; i < Products.length; i++) {
                    const product = mapProducts.get(Products[i].ProductId);
                    if (!product) await this.cielo_products_repository.insert([Products[i]]);
                }
            }
            console.log("PRODUCTS UPDATED");
        };

        await updateEmv();
        await updateBins();
        await updateProducts();

        InitializationVersion.set(cieloResponse.InitializationVersion);

        await this.config_emv_repository.insert({ InitializationVersion: cieloResponse.InitializationVersion } as IConfigEMV);

        console.log("Cielo Tables Updated with success!");
    }
}
