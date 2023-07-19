import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecordDocument = HydratedDocument<Record>;

@Schema()
export class Record {
    @Prop()
    uid: string;

    @Prop()
    name: string;

    @Prop()
    score: number;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
