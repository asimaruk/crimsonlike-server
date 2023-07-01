import { Data } from "db-api";
import { Entity } from "entity-api";
import { inject, injectable } from "inversify";
import { RepositoryRecords } from "repository-records-api";
import "reflect-metadata";
import { TYPES } from "di";

@injectable()
export class DefaultRecordsRepository implements RepositoryRecords {

    static DEFAULT_RECORDS_COUNT = 10;

    constructor(
        @inject(TYPES.Data) private db: Data
    ) {}

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