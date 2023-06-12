import { Entity } from "entity-api";
import { RepositoryRecords } from "repository-records-api";

export class DummyRecordsRepository implements RepositoryRecords {
    
    allRecords(): Promise<Entity.Record[]> {
        return new Promise((resolve, reject) => {
            resolve([
                { uid: '1', name: 'RepositoryJohn', score: 100 },
                { uid: '2', name: 'RepositoryJane', score: 200 },
                { uid: '3', name: 'RepositoryJack', score: 300 },
            ]);
        });
    }

    newRecord(record: Entity.Record): Promise<Entity.NewRecord> {
        return new Promise((resolve, reject) => {
            resolve({
                ...record,
                position: 99
            });
        });
    }
}