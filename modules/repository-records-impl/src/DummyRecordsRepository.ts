import { RepositoryRecords } from "repository-records-api";

export class DummyRecordsRepository implements RepositoryRecords {

    allRecords(): Promise<RepositoryRecords.Record[]> {
        return new Promise((resolve, reject) => {
            resolve([
                { uid: '1', score: 100 },
                { uid: '2', score: 200 },
                { uid: '3', score: 300 },
            ]);
        });
    }

    getRecord(uid: string): Promise<RepositoryRecords.Record | null> {
        return Promise.resolve({
            uid: uid,
            score: 100,
        });
    }

    newRecord(record: RepositoryRecords.Record): Promise<RepositoryRecords.NewRecord> {
        return new Promise((resolve, reject) => {
            resolve({
                ...record,
                position: 99
            });
        });
    }
}