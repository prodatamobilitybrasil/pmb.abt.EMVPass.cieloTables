import { HttpException, IHttpExceptionMessage } from "../../package/exception/http/http_exception";
import { IGateway } from "../gateway";

export class CieloAuthGateway implements IGateway<string> {
    static token: string | undefined;

    constructor(private readonly httpException: HttpException) {}

    async execute(): Promise<string | IHttpExceptionMessage> {
        const url = process.env.CIELO_AUTH_TOKEN!;
        const clientId = process.env.CIELO_CLIENT_ID!;
        const secret = process.env.CIELO_CLIENT_SECRET!;
        const grantType = process.env.CIELO_GRANT_TYPE!;
        try {
            const form = new FormData();
            form.append("client_id", clientId);
            form.append("client_secret", secret);
            form.append("grant_type", grantType);

            const request = new Request(url, {
                method: "POST",
                body: new URLSearchParams(form as any).toString(),
            });

            const response = await fetch(request);

            if(response.status !== 200) return this.httpException.handle("Cielo Auth Token", request, response);

            console.log("Cielo Token Successfully Recovered!");

            const result = await response.text();
            CieloAuthGateway.token = JSON.parse(result).access_token;
            return CieloAuthGateway.token!;
        } catch(err) {
            throw new Error(`Unexpected Error in Cielo Auth Token!\n${JSON.stringify(err)}`);
        }
    }
}
