import { Api } from 'api';
import express, { Request, Response } from 'express';
import { RepositoryRecords } from 'repository-records-api';

export class ExpressServer implements Api {

    private app = express();
    private port = 3000;

    constructor(private repository: RepositoryRecords) {
        this.app.get('/records', async (req: Request, res: Response) => {
            const allRecords = await this.allRecords();
            res.send(allRecords);
        });
        this.app.post('/new_record', async (req: Request, res: Response) => {
            const newRecord = await this.newRecord(req.body);
            res.send(newRecord);
        });
    }

    async allRecords(): Promise<Api.Record[]> {
        const recordEntities = await this.repository.allRecords();
        return recordEntities.map(recordEntity => {
            return {
                uid: recordEntity.uid,
                name: recordEntity.name,
                score: recordEntity.score
            }
        });
    }

    async newRecord(record: Api.Record): Promise<Api.NewRecord> {
        const newRecordEntity = await this.repository.newRecord(record);
        return { 
            uid: newRecordEntity.uid,
            name: newRecordEntity.name,
            score: newRecordEntity.score,
            position: newRecordEntity.position
        }
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server started at port ${this.port}`);
        });
    }
}