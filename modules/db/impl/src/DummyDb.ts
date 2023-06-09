import { Db } from "db-api";

export class DummyDb implements Db {

    private users: Db.User[] = [];
    private records: Db.Record[] = [];

    constructor() {
        this.users = [
            { fingerprint: 'fingerprint_1', uid: '3', name: 'Jack' },
            { fingerprint: 'fingerprint_2', uid: '2', name: 'Jane' },
            { fingerprint: 'fingerprint_3', uid: '1', name: 'John' },
        ];
        this.records = [
            { userId: '3', score: 300 },
            { userId: '2', score: 200 },
            { userId: '1', score: 100 },
        ];
    }

    createUser(fingerprint: String, name: String): Promise<Db.User> {
        throw new Error("Method not implemented.");
    }

    getUser(userId: String): Promise<Db.User | null> {
        return Promise.resolve(this.users.find((u) => u.uid == userId) ?? null);
    }

    getUserByFingerprint(fingerprint: String): Promise<Db.User | null> {
        return Promise.resolve(this.users.find((u) => u.fingerprint == fingerprint) ?? null);
    }

    getRecords(count: number): Promise<Db.Record[]> {
        return new Promise((resolve, reject) => resolve(this.records));
    }

    insertRecord(record: Db.Record): Promise<void> {
        const index = this.records.findIndex((r) => record.userId == r.userId);
        if (index != -1) {
            this.records.splice(index, 1);
        } else {
            const insertIndex = this.records.findIndex((r) => r.score < record.score);
            if (insertIndex == -1) {
                this.records.push(record)
            } else {
                this.records.splice(insertIndex, 0, record);
            }
        }
        return Promise.resolve();
    }

    getRecordPosition(userId: string): Promise<number> {
        return Promise.resolve(this.records.findIndex((r) => userId == r.userId));
    }
    
}