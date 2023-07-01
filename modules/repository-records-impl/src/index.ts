import { RepositoryRecords } from "repository-records-api";
import { DefaultRecordsRepository } from "./RecordsRepository";
import { TYPES, container } from 'di';

TYPES.RepositoryRecords = Symbol.for('RepositoryRecords');
container.bind<RepositoryRecords>(TYPES.RepositoryRecords).to(DefaultRecordsRepository);