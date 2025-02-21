import dotenv from "dotenv";
import { createServer } from "http";
import { Router } from "./router";
import { MongoDB } from "./infra/mongo_db/mongo_db";
import cielo_tables_init_usecase from "./usecases/cielo_tables_init";
import { CieloAuthGateway } from "./gateways/cielo_auth/cielo_auth_gateway";

dotenv.config();

const mongo_db = new MongoDB();
mongo_db.connect();

const cieloAuth = new CieloAuthGateway();
cieloAuth.execute();

const server = createServer(Router.handle);

const port = process.env.PORT || "8080";

server.listen(port, () => {
    console.log(`Server Running on Port: ${port}`);
});

setTimeout(async () => {
    await cielo_tables_init_usecase.execute();
}, 2000);
