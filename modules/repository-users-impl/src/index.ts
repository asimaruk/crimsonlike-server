import { TYPES, container } from "di";
import { UsersRepository } from "repository-users-api";
import { DefaultUsersRepository } from "./DefaultUsersRepository";

TYPES.UsersRepository = Symbol.for('UsersRepository');
container.bind<UsersRepository>(TYPES.UsersRepository).to(DefaultUsersRepository);