export interface Db {
    getRecords(count: number): Promise<Db.Record[]>;
    insertRecord(record: Db.Record): Promise<void>;
    getRecordPosition(record: Db.Record): Promise<number>;
}

declare namespace Db {
    export type Record = {
        uid: String,
        name: String,
        score: number
    };
}