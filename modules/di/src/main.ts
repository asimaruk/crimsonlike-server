import { Container } from "inversify"

const TYPES: { [key: string]: symbol } = {};

const container = new Container();

export { TYPES, container };