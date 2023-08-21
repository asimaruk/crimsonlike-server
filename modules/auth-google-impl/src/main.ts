import { AuthPlatform } from "auth-api";
import { TYPES, container } from "di";
import { GoogleAuth } from "./GoogleAuth";
import path from "path";
import dotenv from "dotenv";

TYPES.GoogleAuth = Symbol.for('GoogleAuth');
container.bind<AuthPlatform>(TYPES.GoogleAuth).to(GoogleAuth);

for (let i = 0;;i++) {
    const envPath = path.resolve(__dirname, '../'.repeat(i), '.env');
    const config = dotenv.config({ path: envPath });
    if (config.parsed) {
        break;
    }
}