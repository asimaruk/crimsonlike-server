export interface Api {
    allRecords(): Promise<Api.Record[]>;
    newRecord(record: Api.Record): Promise<Api.NewRecord>;
    start(): void;
}

declare namespace Api {
    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = Record & {
        position: number
    };
}