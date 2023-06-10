import { Data } from "db-api";
import { MongoDatabase } from "./MongoDatabase";

export function createDb(): Data {
    const db = new MongoDatabase();
    db.setup();
    return db;
}