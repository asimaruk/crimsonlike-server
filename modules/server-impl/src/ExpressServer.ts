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
        @inject(TYPES.RepositoryRecords) private recordsRepository: RepositoryRecords,
        @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
        @inject(TYPES.GoogleAuth) private googleAuth: AuthPlatform,
    ) {
        // TODO: add error handling for all routes
        this.app.use(express.json());
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            await this.checkLogin(req.body);
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
            const newRecord = await this.newRecord(req.body);
            res.send(newRecord);
        });
        this.app.post('/update_user', async (req: Request, res: Response) => {
            await this.updateUser(req.body);
        });
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

    async checkLogin(body: any): Promise<void> {
        if ('authToken' in body && 'uid' in body) {
            if (this.token2Id[body.authToken] != body.uid) {
                await this.login(body);
                if (this.token2Id[body.authToken] != body.uid) {
                    // send error
                    return;
                }
            }
        }
    }

    async allRecords(): Promise<Api.Record[]> {
        const recordEntities = await this.recordsRepository.allRecords();
        return recordEntities.map(recordEntity => {
            return {
                uid: recordEntity.uid,
                name: recordEntity.name,
                score: recordEntity.score
            }
        });
    }

    async newRecord(record: Api.NewRecord): Promise<Api.NewRecordResult> {
        const newRecordEntity = await this.recordsRepository.newRecord({
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

    async updateUser(userUpdate: Api.UserUpdate) {
        await this.usersRepository.updateUser(userUpdate.uid, {
            name: userUpdate.name
        });
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server started at port ${this.port}`);
        });
    }
}