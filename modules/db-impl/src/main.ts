import { Data } from "db-api";
import { MongoDatabase } from "./MongoDatabase";
import { container, TYPES } from 'di';

TYPES.Data = Symbol.for('Data');
container.bind<Data>(TYPES.Data).to(MongoDatabase);