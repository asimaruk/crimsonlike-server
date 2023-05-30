import { RepositoryRecords } from "repository-records-api";
import { DummyRecordsRepository } from "./DummyRecordsRepository";

export function createRecordsRepository(): RepositoryRecords {
    return new DummyRecordsRepository();
}