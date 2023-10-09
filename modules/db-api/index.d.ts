export interface Data {
    setup(): Promise<void>;
    getUser(userId: string): Promise<Data.User | null>;
    getRecords(count: number): Promise<Data.Record[]>;
    getRecord(userId: string): Promise<Data.Record | null>;
    createUser(userId: string, userName: string): Promise<Data.User>;
    insertRecord(record: Data.Record): Promise<void>;
    getRecordPosition(userId: string): Promise<number>;
    updateUser(userId: string, properties: Data.UserProperties): Promise<void>;
}

declare namespace Data {
    export type Record = {
        readonly userId: string,
        readonly score: number,
    };

    export type User = {
        readonly uid: string,
        readonly name: string,
    };

    export type UserProperties = Partial<Omit<User, 'uid'>>;
}