import { Api } from "api";
import { DummyExpressServer } from "./DummyExpressServer";

export function createApi(): Api {
    return new DummyExpressServer();
}