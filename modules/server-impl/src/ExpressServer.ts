import { Api } from 'server-api';
import express, { NextFunction, Request, Response } from 'express';
import { RepositoryRecords } from 'repository-records-api';
import { inject, injectable } from 'inversify';
import "reflect-metadata";
import { TYPES } from 'di';
import { UsersRepository } from 'repository-users-api';
import { AuthPlatform } from 'auth-api';

@injectable()
export class ExpressServer implements Api {

    private app = express();
    private port = 3000;
    private token2Id: { [key: string]: string } = {};

    constructor(
        @inject(TYPES.RepositoryRecords) private repository: RepositoryRecords,
        @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
        @inject(TYPES.GoogleAuth) private googleAuth: AuthPlatform,
    ) {
        // TODO: add error handling for all routes
        this.app.use(express.json());
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        this.app.post('/login', async (req: Request, res: Response) => {
            const loginResult = await this.login(req.body);
            res.send(loginResult);
        });
        this.app.get('/records', async (req: Request, res: Response) => {
            const allRecords = await this.allRecords();
            res.send(allRecords);
        });
        this.app.post('/new_record', async (req: Request, res: Response) => {
            const reqBody = req.body as Api.NewRecord;
            if (this.token2Id[reqBody.authToken] != reqBody.uid) {
                if (this.isLogin(reqBody)) {
                    await this.login(reqBody);
                }
                if (this.token2Id[reqBody.authToken] != reqBody.uid) {
                    // send error
                    return;
                }
            }
            const newRecord = await this.newRecord(req.body);
            res.send(newRecord);
        });
    }

    private isLogin = (body: any): boolean => {
        return 'authType' in body && 'authToken' in body;
    }

    async login(auth: Api.Login): Promise<Api.User> {
        if (auth.authType == 'gg') {
            const uid = await this.googleAuth.verify(auth.authToken);
            this.token2Id[auth.authToken] = uid;
            return this.usersRepository.getUser(uid);
        } else {
            throw new Error(`Unknown authorization type: ${auth.authType}`);
        }
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

    async newRecord(record: Api.NewRecord): Promise<Api.NewRecordResult> {
        const newRecordEntity = await this.repository.newRecord({
            name: record.name,
            score: record.score,
            uid: record.uid
        });
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