import { container, TYPES } from 'di';
import { Api } from 'server-api';
import 'db-impl';
import 'repository-records-impl';
import 'repository-users-impl';
import 'auth-google-impl';
import 'server-impl';

const api = container.get<Api>(TYPES.Api);

function main() {
    api.start();
}

main();