export namespace Entity {
    export type Record = {
        uid: String,
        name: String,
        score: number
    };

    export type NewRecord = Record & {
        position: number
    };
}