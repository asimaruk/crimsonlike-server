import { Db } from "db-api";
import { DummyDb } from "./DummyDb";

export function createDb(): Db {
    return new DummyDb();
}