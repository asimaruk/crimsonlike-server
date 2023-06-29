import { Data } from "db-api";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "./models";
import path from "path";

type MongoUser = Omit<Data.User, "uid"> & { _id: string };
type MongoRecord = Data.Record & { _id: ObjectId };

export class MongoDatabase implements Data {

    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collections: {
        users?: Collection<MongoUser>,
        records?: Collection<MongoRecord>,
    } = {};
    private latestUserId: number = 0;
    private initializeResolve: (value: void | PromiseLike<void>) => void = () => {};
    private initialize: Promise<void> = new Promise((resolve) => {
        this.initializeResolve = resolve;
    });

    async setup(): Promise<void> {
        for (let i = 0;;i++) {
            const envPath = path.resolve(__dirname, '../'.repeat(i), '.env');
            const config = dotenv.config({ path:  envPath });
            if (config.parsed) {
                break;
            }
        }

        this.client = await MongoClient.connect(process.env.DB_CONN_STRING as string);
        this.db = this.client.db(process.env.DB_NAME);
        this.collections.users = this.db.collection(process.env.USERS_COLLECTION_NAME!);
        this.collections.records = this.db.collection(process.env.RECORDS_COLLECTION_NAME!);
        console.log(`Successfully connected to database: ${this.db.databaseName}`);

        const lastUser = await this.collections.users?.findOne({}, { sort:{ $natural: -1 }});
        this.latestUserId = Number(lastUser?._id) || 0;

        this.collections.users.createIndex('fingerprint');
        this.collections.records.createIndex('userId');
        console.log('Successfully created database indeces');
        this.initializeResolve();
    }

    async getUser(userId: String): Promise<Data.User | null> {
        await this.initialize;
        const user = await this.collections.users?.findOne({ uid: userId });
        if (!user) {
            return null;
        }
        return convertMongoUser(user);
    }

    async getUserByFingerprint(fingerprint: String): Promise<Data.User | null> {
        await this.initialize;
        const user = await this.collections.users?.findOne({ fingerprint: fingerprint });
        if (!user) {
            return null;
        }
        return convertMongoUser(user);
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

    async createUser(fingerprint: string, name: string): Promise<Data.User> {
        await this.initialize;
        const insertResult = await this.collections.users?.insertOne({
            _id: (++this.latestUserId).toString(),
            fingerprint: fingerprint,
            name: name
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

}

function convertMongoUser(u: MongoUser): Data.User {
    const { _id: uid, ...rest } = u;
    return new User(rest.fingerprint, uid, rest.name);
}

function convertMongoRecord(r: MongoRecord) {
    const { _id: id, ...rest } = r;
    return {
        ...rest
    }
}