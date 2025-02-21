import { CieloAuthGateway } from "../cielo_auth/cielo_auth_gateway";
import { IGateway } from "../gateway";
import { ICieloTablesResponse } from "./cielo_tables";

export class CieloTablesGateway implements IGateway<ICieloTablesResponse> {
    
    async execute(): Promise<ICieloTablesResponse | undefined> {
        const baseUrl = process.env.CIELO_TABLES!;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${CieloAuthGateway.token}`);
            if (process.env.ENVIRONMENT !== "PROD") headers.append("Environment", "Homologacao");
            
            const response = await fetch(baseUrl, { method: "GET", headers });

            const result = await response.json();

            if(response.status !== 200) throw new Error(`Status: ${response.status} - ${response.statusText}\n ${result}`);

            return result as ICieloTablesResponse;
        } catch(err) {
            console.log("Error cielo tables!\n", err);
        }
    }
}
