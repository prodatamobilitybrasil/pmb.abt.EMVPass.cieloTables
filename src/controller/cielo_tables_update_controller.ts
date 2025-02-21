import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import cielo_tables_upsert_usecase from "../usecases/cielo_tables_upsert";

export class CieloTablesUpdateController {
    static async handle(req: IncomingMessage, res: ServerResponse) {
        try {
            const { version } = url.parse(req.url!, true).query;
            if (!version) throw new Error("Version is Required");

            await cielo_tables_upsert_usecase.execute(parseInt(version as string));
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: 200, type: "OK" , message: "Updated With Success" }));
        } catch(err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            if (err instanceof Error) res.end(JSON.stringify({ status: 500, type: "Internal Server Error" , error: err.message }));
            else res.end(JSON.stringify({ status: 500, type: "Internal Server Error" , error: "unknown error" }));
        }
    }
}
