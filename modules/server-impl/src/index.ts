import { Api } from "server-api";
import { ExpressServer } from "./ExpressServer";
import { TYPES, container } from 'di';

TYPES.Api = Symbol.for('Api');
container.bind<Api>(TYPES.Api).to(ExpressServer);