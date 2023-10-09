import { Data } from "db-api";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "./models";
import path from "path";
import { injectable } from "inversify";
import 'reflect-metadata';

type MongoUser = Omit<Data.User, "uid"> & { _id: string };
type MongoRecord = Data.Record & { _id: ObjectId };

@injectable()
export class MongoDatabase implements Data {

    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collections: {
        users?: Collection<MongoUser>,
        records?: Collection<MongoRecord>,
    } = {};
    private initializeResolve: (value: void | PromiseLike<void>) => void = () => {};
    private initialize: Promise<void> = new Promise((resolve) => {
        this.initializeResolve = resolve;
    });

    constructor() {
        this.setup();
    }

    async setup(): Promise<void> {
        for (let i = 0;;i++) {
            const envPath = path.resolve(__dirname, '../'.repeat(i), '.env');
            const config = dotenv.config({ path: envPath });
            if (config.parsed) {
                break;
            }
        }

        this.client = await MongoClient.connect(process.env.DB_CONN_STRING as string);
        this.db = this.client.db(process.env.DB_NAME);
        this.collections.users = this.db.collection(process.env.USERS_COLLECTION_NAME!);
        this.collections.records = this.db.collection(process.env.RECORDS_COLLECTION_NAME!);
        console.log(`Successfully connected to database: ${this.db.databaseName}`);

        this.collections.records.createIndex('userId');
        console.log('Successfully created database indeces');
        this.initializeResolve();
    }

    async getUser(userId: String): Promise<Data.User | null> {
        await this.initialize;
        const user = await this.collections.users?.findOne({ _id: userId });
        if (!user) {
            return null;
        }
        return convertMongoUser(user);
    }

    async getRecord(userId: string): Promise<Data.Record | null> {
        await this.initialize;
        const record = await this.collections.records?.findOne({ userId: userId });
        return record ? convertMongoRecord(record) : null;
    }

    async getRecords(count: number): Promise<Data.Record[]> {
        await this.initialize;
        const records = await this.collections.records
            ?.find()
            .sort({ score: -1 })
            .limit(count)
            .map(convertMongoRecord)
            .toArray();
        return records ?? [];
    }

    async createUser(userId: string, userName: string): Promise<Data.User> {
        await this.initialize;
        const insertResult = await this.collections.users?.insertOne({
            _id: userId,
            name: userName,
        });
        const mongoUser = await this.collections.users?.findOne({ _id: insertResult?.insertedId });
        if (!mongoUser) throw Error("Error creating user");
        return convertMongoUser(mongoUser);
    }

    async insertRecord(record: Data.Record): Promise<void> {
        await this.initialize;
        await this.collections.records?.updateOne(
            { userId: record.userId },
            { $set: { score: record.score}},
            { upsert: true }
        );
    }

    async getRecordPosition(userId: string): Promise<number> {
        await this.initialize;
        const record = await this.collections.records?.findOne({ userId: userId });
        const position = await this.collections.records?.countDocuments({ score: { $lt: record?.score ?? 0 }});
        return position ?? 0;
    }

    async updateUser(userId: string, properties: Data.UserProperties): Promise<void> {
        await this.initialize;
        await this.collections.users?.updateOne(
            { userId: userId },
            { $set: properties }
        )
    }
}

function convertMongoUser(u: MongoUser): Data.User {
    const { _id: uid, ...rest } = u;
    return new User(uid, rest.name);
}

function convertMongoRecord(r: MongoRecord) {
    const { _id: id, ...rest } = r;
    return {
        ...rest
    }
}