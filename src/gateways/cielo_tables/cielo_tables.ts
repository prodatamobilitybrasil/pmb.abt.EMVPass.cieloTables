import { ICieloBin } from "../../entities/cielo_bin";
import { ICieloEMV } from "../../entities/cielo_emv";
import { ICieloProduct } from "../../entities/cielo_product";

export interface ICieloTablesResponse {
    Emv: ICieloEMV[];
    Bins: ICieloBin[];
    Products: ICieloProduct[];
    InitializationVersion: number;
};
