import { IncomingMessage, ServerResponse } from "http";
import { CieloTablesUpdateController } from "../controller/cielo_tables_update_controller";

export class Router {
    static async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
        console.log(`${new Date().toISOString()} - Request Received - ${req.method} ${req.url}`);

        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: 200, type: "OK" , message: "I am Batman!" }));
            return;
        }

        if (req.method === "PUT" && req.url?.includes("/updateCieloTables")) return CieloTablesUpdateController.handle(req, res);

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: 404, type: "Error" , message: "Route not found!" }));
    }
}
