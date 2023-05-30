export interface Api {
    allRecords(): Promise<Api.Record[]>;
    newRecord(record: Api.Record): Promise<Api.NewRecord>;
    start(): void;
}

declare namespace Api {
    export type Record = {
        uid: String,
        name: String,
        score: number
    };

    export type NewRecord = Record & {
        position: number
    };
}