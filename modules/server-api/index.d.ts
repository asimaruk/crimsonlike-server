export interface Api {
    login(auth: Api.Login): Promise<Api.User>;
    allRecords(): Promise<Api.Record[]>;
    newRecord(record: Api.NewRecord): Promise<Api.NewRecordResult>;
    start(): void;
}

declare namespace Api {

    export type AuthType = 'gg'

    export type Login = {
        authType: AuthType,
        authToken: string
    };

    export type LoginSuccess = {
        uid: string
    };

    export type LoginFailure = {
        error: string
    };

    export type LoginResult = LoginSuccess | LoginFailure;

    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = Login & Record;

    export type NewRecordResult = Record & {
        position: number
    };

    export type User = {
        id: string,
        name: string,
    }
}