export interface Data {
    setup(): Promise<void>;
    getUser(userId: string): Promise<Data.User | null>;
    getUserByFingerprint(fingerprint: string): Promise<Data.User | null>;
    getRecords(count: number): Promise<Data.Record[]>;
    createUser(fingerprint: string, name: string): Promise<Data.User>;
    insertRecord(record: Data.Record): Promise<void>;
    getRecordPosition(userId: string): Promise<number>;
}

declare namespace Data {
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