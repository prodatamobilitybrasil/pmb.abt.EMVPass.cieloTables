import { HttpException, IHttpExceptionMessage } from "../../package/exception/http/http_exception";
import { CieloAuthGateway } from "../cielo_auth/cielo_auth_gateway";
import { IGateway } from "../gateway";
import { ICieloTablesResponse } from "./cielo_tables";

export class CieloTablesGateway implements IGateway<ICieloTablesResponse> {
    constructor(private readonly exception: HttpException) {}
    
    async execute(): Promise<ICieloTablesResponse | IHttpExceptionMessage> {
        const baseUrl = process.env.CIELO_TABLES!;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${CieloAuthGateway.token}`);
            if (process.env.ENVIRONMENT !== "PROD") headers.append("Environment", "Homologacao");

            const request = new Request(baseUrl, {
                method: "GET",
                headers,
            })
            
            const response = await fetch(request);

            const result = await response.json();

            if(response.status !== 200) throw this.exception.handle("Cielo Tables", request, response);

            return result as ICieloTablesResponse;
        } catch(err) {
            throw new Error(`Unexpected Error in Cielo Tables!\n${JSON.stringify(err)}`);
        }
    }
}
