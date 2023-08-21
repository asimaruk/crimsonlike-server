export namespace Entity {
    export type Record = {
        uid: string,
        name: string,
        score: number
    };

    export type NewRecord = Record & {
        position: number
    };

    export type User = {
        id: string,
        name: string
    };
}