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
            const [user, record] = await Promise.all([
                this.usersRepository.getUser(uid),
                this.recordsRepository.getRecord(uid),
            ]);
            return {
                id: user.id,
                name: user.name,
                score: record?.score ?? 0,
            };
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
        const users = await Promise.all(recordEntities.map(e => this.usersRepository.getUser(e.uid)))
        return recordEntities.map((recordEntity, index) => {
            return {
                uid: recordEntity.uid,
                name: users[index].name,
                score: recordEntity.score
            }
        });
    }

    async newRecord(record: Api.NewRecord): Promise<Api.NewRecordResult> {
        const newRecordEntity = await this.recordsRepository.newRecord({
            uid: record.uid,
            score: record.score,
        });
        return {
            uid: newRecordEntity.uid,
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