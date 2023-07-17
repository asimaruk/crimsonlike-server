import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Record } from './schemas/record.schema';
import { Model } from 'mongoose';

@Injectable()
export class RecordsService {
    constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

    create(createRecordDto: CreateRecordDto): Promise<Record> {
        const createdRecord = new this.recordModel(createRecordDto);
        return createdRecord.save();
    }

    findAll(): Promise<Record[]> {
        return this.recordModel.find().exec();
    }

    findOne(id: number) {
        return `This action returns a #${id} record`;
    }

    update(id: number, updateRecordDto: UpdateRecordDto) {
        return `This action updates a #${id} record`;
    }

    remove(id: number) {
        return `This action removes a #${id} record`;
    }
}
