import { PartialType } from '@nestjs/mapped-types';

export class CreateRecordDto {
    readonly uid: string;
    readonly name: string;
    readonly score: number;
}

export class UpdateRecordDto extends PartialType(CreateRecordDto) {}
