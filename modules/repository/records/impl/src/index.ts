import { RepositoryRecords } from "repository-records-api";
import { DefaultRecordsRepository } from "./RecordsRepository";
import { createDb } from 'db-impl';

export function createRecordsRepository(): RepositoryRecords {
    return new DefaultRecordsRepository(createDb());
}