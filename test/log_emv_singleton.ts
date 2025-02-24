import { ILogEMV } from "../src/entities/log_emv";

export const log_emv_singleton = {
    "service": "CieloTablesService",
    "message": "Unxpected Exception: Cielo tables alreadly updated!",
    "error": {
      "message": "Cielo Tables Alreadly Updated",
      "data": {
        "databaseVersion": "12345678910",
        "cieloVersion": "12345678910",
      }
    },
    "date": "2025-02-18T17:35:05.915Z",
} as unknown as ILogEMV;
