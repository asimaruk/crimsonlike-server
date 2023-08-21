import { Data } from "db-api";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DummyDb implements Data {

    private users: Data.User[] = [];
    private records: Data.Record[] = [];
    private lastUid: number = 0;
    private names: string[] = ['John', 'Jane', 'Jack'];

    setup(): Promise<void> {
        for (; this.lastUid < 3; this.lastUid++) {
            this.users.push({
                uid: `${this.lastUid}`,
                name: this.names[this.lastUid % this.names.length],
            });
            this.records.push({
                userId: `${this.lastUid}`,
                score: 100 * (this.lastUid + 1),
            });
        }
        return Promise.resolve();
    }

    createUser(userId: string, userName: string): Promise<Data.User> {
        const user: Data.User = {
            uid: userId,
            name: userName
        };
        this.users.push(user);
        return Promise.resolve(user);
    }

    getUser(userId: String): Promise<Data.User | null> {
        return Promise.resolve(this.users.find((u) => u.uid == userId) ?? null);
    }

    updateUser(userId: string, properties: Partial<Omit<Data.User, "uid">>): Promise<void> {
        const updatingUser = this.users.find((u) => u.uid == userId);
        if (updatingUser) {
            Object.assign(updatingUser, properties);
        }
        return Promise.resolve();
    }

    getRecords(count: number): Promise<Data.Record[]> {
        return new Promise((resolve, reject) => resolve(this.records));
    }

    insertRecord(record: Data.Record): Promise<void> {
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