import { Api } from 'api';
import express, { Request, Response } from 'express';

export class DummyExpressServer implements Api {

    private app = express();
    private port = 3000;

    constructor() {
        this.app.get('/records', async (req: Request, res: Response) => {
            const allRecords = await this.allRecords();
            res.send(allRecords);
        });
        this.app.post('/new_record', async (req: Request, res: Response) => {
            const newRecord = await this.newRecord(req.body);
            res.send(newRecord);
        });
    }

    allRecords(): Promise<Api.Record[]> {
        return new Promise((resolve, reject) => {
            resolve([
                { uid: '1', name: 'John', score: 100 },
                { uid: '2', name: 'Jane', score: 200 },
                { uid: '3', name: 'Jack', score: 300 },
            ]);
        });
    }

    newRecord(record: Api.Record): Promise<Api.NewRecord> {
        return new Promise((resolve, reject) => {
            resolve({
                ...record,
                position: 99
            });
        });
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server started at port ${this.port}`);
        });
    }
}