import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto, UpdateRecordDto } from './record.dto';

@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}

    @Post()
    create(@Body() createRecordDto: CreateRecordDto) {
        return this.recordsService.create(createRecordDto);
    }

    @Get()
    findAll() {
        return this.recordsService.findAll();
    }

    @Get(':uid')
    findOne(@Param('uid') id: string) {
        return this.recordsService.findOne(+id);
    }

    @Patch(':uid')
    update(@Param('uid') id: string, @Body() updateRecordDto: UpdateRecordDto) {
        return this.recordsService.update(+id, updateRecordDto);
    }

    @Delete(':uid')
    remove(@Param('uid') id: string) {
        return this.recordsService.remove(+id);
    }
}
