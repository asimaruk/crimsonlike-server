export interface UsersRepository {
    getUser(id: string): Promise<UsersRepository.User>;
    updateUser(id: string, properties: UsersRepository.UserProperties): Promise<void>;
}

declare namespace UsersRepository {
    export type User = {
        id: string,
        name: string,
    };

    export type UserProperties = Partial<Omit<User, 'id'>>
}