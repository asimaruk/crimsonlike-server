import { Db } from "db-api";

export default class Record implements Db.Record {
    
    constructor(
        public userId: string, 
        public score: number
    ) {}
    
}