import { Injectable } from '@nestjs/common';
import { CreateRecordDto, UpdateRecordDto } from './record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';

@Injectable()
export class RecordsService {
    constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

    async create(createRecordDto: CreateRecordDto): Promise<Record> {
        const createdRecord = await this.recordModel.create(createRecordDto);
        return createdRecord;
    }

    findAll(): Promise<Record[]> {
        return this.recordModel.find().exec();
    }

    findOne(id: number): Promise<Record> {
        return this.recordModel.findOne({ _id: id }).exec();
    }

    async update(id: number, updateRecordDto: UpdateRecordDto): Promise<Record> {
        const updatedRecord = await this.recordModel.findOneAndUpdate({ _id: id }, updateRecordDto).exec();
        return updatedRecord;
    }

    async remove(id: number): Promise<Record> {
        const removedRecord = await this.recordModel.findByIdAndRemove({ _id: id }).exec();
        return removedRecord;
    }
}
