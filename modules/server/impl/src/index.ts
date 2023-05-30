import { Api } from "api";
import { ExpressServer } from "./ExpressServer";
import { createRecordsRepository } from "repository-records-impl";

export function createApi(): Api {
    // return new DummyExpressServer();
    return new ExpressServer(createRecordsRepository());
}