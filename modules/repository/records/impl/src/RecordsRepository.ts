import { Db } from "db-api";
import { Entity } from "entity-api";
import { RepositoryRecords } from "repository-records-api";

export class DefaultRecordsRepository implements RepositoryRecords {

    static DEFAULT_RECORDS_COUNT = 10;

    constructor(private db: Db) {

    }

    async allRecords(): Promise<Entity.Record[]> {
        const records = await this.db.getRecords(DefaultRecordsRepository.DEFAULT_RECORDS_COUNT);
        const users = await Promise.all(records.map(async (r) => {
            return this.db.getUser(r.userId);
        }));
        return records.map((r) => {
            const user = users.find((u) => u?.uid == r.userId);
            return {
                uid: user?.uid ?? "",
                name: user?.name ?? "unknown",
                score: r.score,
            };
        });
    }

    async newRecord(record: Entity.Record): Promise<Entity.NewRecord> {
        await this.db.insertRecord({
            userId: record.uid,
            score: record.score

        });
        const position = await this.db.getRecordPosition(record.uid);
        return {
            ...record,
            position
        };
    }

}