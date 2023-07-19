import { Module } from '@nestjs/common';
import { RecordsModule } from './records/records.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/crimsonlike'),
        RecordsModule
    ]
})

export class AppModule {}
