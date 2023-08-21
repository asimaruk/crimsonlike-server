import { Api } from 'server-api';
import express, { Request, Response } from 'express';

export class DummyExpressServer implements Api {

    private app = express();
    private port = 3000;

    constructor() {
        this.app.get('/login', async (req: Request, res: Response) => {
            const loginResult = await this.login(req.body);
            res.send(loginResult);
        });
        this.app.get('/records', async (req: Request, res: Response) => {
            const allRecords = await this.allRecords();
            res.send(allRecords);
        });
        this.app.post('/new_record', async (req: Request, res: Response) => {
            const newRecord = await this.newRecord(req.body);
            res.send(newRecord);
        });
    }

    login(auth: Api.Login): Promise<Api.User> {
        return Promise.resolve({
            id: '1',
            name: 'Username#1'
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

    newRecord(record: Api.NewRecord): Promise<Api.NewRecordResult> {
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