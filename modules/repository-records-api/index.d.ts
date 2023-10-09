export interface RepositoryRecords {
    allRecords(): Promise<RepositoryRecords.Record[]>;
    getRecord(uid: string): Promise<RepositoryRecords.Record | null>;
    newRecord(record: RepositoryRecords.Record): Promise<RepositoryRecords.NewRecord>;
}

declare namespace RepositoryRecords {
    export type Record = {
        uid: string,
        score: number,
    };

    export type NewRecord = Record & {
        position: number,
    };
}