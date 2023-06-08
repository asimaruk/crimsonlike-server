import { Db } from "db-api";

export class DummyDb implements Db {

    private data: Db.Record[] = []

    constructor() {
        this.data = [
            { uid: '3', name: 'RepositoryJack', score: 300 },
            { uid: '2', name: 'RepositoryJane', score: 200 },
            { uid: '1', name: 'RepositoryJohn', score: 100 },
        ];
    }

    getRecords(count: number): Promise<Db.Record[]> {
        return new Promise((resolve, reject) => resolve(this.data));
    }

    insertRecord(record: Db.Record): Promise<void> {
        const index = this.data.findIndex((r) => record.uid = r.uid);
        if (index != -1) {
            this.data.splice(index, 1);
        } else {
            const insertIndex = this.data.findIndex((r) => r.score < record.score);
            if (insertIndex == -1) {
                this.data.push(record)
            } else {
                this.data.splice(insertIndex, 0, record);
            }
        }
        return Promise.resolve();
    }

    getRecordPosition(record: Db.Record): Promise<number> {
        return Promise.resolve(this.data.findIndex((r) => record.uid = r.uid));
    }
    
}