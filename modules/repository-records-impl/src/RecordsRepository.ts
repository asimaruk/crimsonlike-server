import { Data } from "db-api";
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

    async allRecords(): Promise<RepositoryRecords.Record[]> {
        const records = await this.db.getRecords(DefaultRecordsRepository.DEFAULT_RECORDS_COUNT);
        return records.map((r) => {
            return {
                uid: r.userId,
                score: r.score,
            }
        });
    }

    async getRecord(uid: string): Promise<RepositoryRecords.Record | null> {
        const record = await this.db.getRecord(uid);
        return record ? {
            uid: record.userId,
            score: record.score,
        } : null;
    }

    async newRecord(record: RepositoryRecords.Record): Promise<RepositoryRecords.NewRecord> {
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