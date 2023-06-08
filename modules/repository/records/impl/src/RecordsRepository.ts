import { Db } from "db-api";
import { Entity } from "entity-api";
import { RepositoryRecords } from "repository-records-api";

export class DefaultRecordsRepository implements RepositoryRecords {

    static DEFAULT_RECORDS_COUNT = 10;

    constructor(private db: Db) {

    }

    allRecords(): Promise<Entity.Record[]> {
        return this.db.getRecords(DefaultRecordsRepository.DEFAULT_RECORDS_COUNT);
    }

    async newRecord(record: Entity.Record): Promise<Entity.NewRecord> {
        await this.db.insertRecord(record);
        const position = await this.db.getRecordPosition(record);
        return {
            ...record,
            position
        };
    }

}