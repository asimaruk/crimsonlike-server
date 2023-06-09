export interface Db {
    getUser(userId: String): Promise<Db.User | null>;
    getUserByFingerprint(fingerprint: String): Promise<Db.User | null>;
    getRecords(count: number): Promise<Db.Record[]>;
    createUser(fingerprint: String, name: String): Promise<Db.User>;
    insertRecord(record: Db.Record): Promise<void>;
    getRecordPosition(userId: string): Promise<number>;
}

declare namespace Db {
    export type Record = {
        readonly userId: string,
        readonly score: number,
    };

    export type User = {
        readonly fingerprint: string,
        readonly uid: string,
        readonly name: string,
    };
}