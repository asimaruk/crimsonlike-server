import { Entity } from "entity-api";

export interface RepositoryRecords {
    allRecords(): Promise<Entity.Record[]>;
    newRecord(record: Entity.Record): Promise<Entity.NewRecord>;
}