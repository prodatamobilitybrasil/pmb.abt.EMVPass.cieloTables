import { IGateway } from "../gateway";

export class CieloAuthGateway implements IGateway<string> {
    static token: string | undefined;

    async execute(): Promise<string | undefined> {
        const url = process.env.CIELO_AUTH_TOKEN!;
        const clientId = process.env.CIELO_CLIENT_ID!;
        const secret = process.env.CIELO_CLIENT_SECRET!;
        const grantType = process.env.CIELO_GRANT_TYPE!;
        try {
            const form = new FormData();
            form.append("client_id", clientId);
            form.append("client_secret", secret);
            form.append("grant_type", grantType);

            const response = await fetch(url, {
                method: "POST",
                body: new URLSearchParams(form as any).toString(),
            });

            const result = await response.text();

            if(response.status !== 200) throw new Error(`Status: ${response.status} - ${response.statusText}\n ${result}`);
            const token = JSON.parse(result).access_token;
            CieloAuthGateway.token = token;
            return token;
        } catch(err) {
            console.log("Error to auth Cielo!\n", err);
        }
    }
}
