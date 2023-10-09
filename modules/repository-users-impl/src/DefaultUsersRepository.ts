import { inject, injectable } from 'inversify';
import { UsersRepository } from 'repository-users-api'
import { TYPES } from 'di';
import { Data } from 'db-api'

@injectable()
export class DefaultUsersRepository implements UsersRepository {

    constructor(
        @inject(TYPES.Data) private db: Data
    ) {}

    async getUser(id: string): Promise<UsersRepository.User> {
        const existingUser = await this.db.getUser(id);
        if (existingUser) {
            return this.toRepositoryUser(existingUser);
        } else {
            const createdUser = await this.db.createUser(id, `Username#${id}`);
            return this.toRepositoryUser(createdUser);
        }
    }

    async updateUser(id: string, properties: UsersRepository.UserProperties): Promise<void> {
        await this.db.updateUser(id, properties);
        return Promise.resolve();
    }

    private toRepositoryUser(dbUser: Data.User): UsersRepository.User {
        return {
            id: dbUser.uid,
            name: dbUser.name,
        };
    }
}