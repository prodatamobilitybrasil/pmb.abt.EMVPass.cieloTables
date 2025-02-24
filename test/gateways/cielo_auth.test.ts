import dotenv from "dotenv";
import { CieloAuthGateway } from "../../src/gateways/cielo_auth/cielo_auth_gateway";
import { CieloTablesGateway } from "../../src/gateways/cielo_tables/cielo_tables_gateway";
import { HttpException } from "../../src/package/exception/http/http_exception";
import { ICieloTablesResponse } from "../../src/gateways/cielo_tables/cielo_tables";

dotenv.config();

describe("Teste Integração API Cielo", () => {
    const gateway = new CieloAuthGateway(new HttpException());

    test("Authorization Token Cielo", async () => {
        const result = await gateway.execute();
        expect(typeof result).toBe("string");
    });

    test("Initialization Cielo", async () => {
        const tables_gateway = new CieloTablesGateway(new HttpException());
        const result = await tables_gateway.execute();
        const { InitializationVersion } = result as ICieloTablesResponse;
        
        expect(InitializationVersion).toBeDefined();
    });
});
