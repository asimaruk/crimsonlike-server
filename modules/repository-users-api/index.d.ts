import { Entity } from 'entity-api';

export interface UsersRepository {
    getUser(id: string): Promise<Entity.User>;
    updateUser(id: string, properties: UsersRepository.UserProperties): Promise<void>;
}

declare namespace UsersRepository {
    export type UserProperties = Partial<Omit<Entity.User, 'id'>>;
}