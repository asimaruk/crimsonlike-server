import { Data } from "db-api";

export class Record implements Data.Record {
    
    constructor(
        public readonly userId: string, 
        public readonly score: number
    ) {}
}

export class User implements Data.User {

    constructor (
        public readonly fingerprint: string,
        public readonly uid: string,
        public readonly name: string,
    ) {}
}