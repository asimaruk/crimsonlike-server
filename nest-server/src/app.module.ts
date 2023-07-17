import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordsModule } from './records/records.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/crimsonlike'),
        RecordsModule,
        DatabaseModule
    ],
    controllers: [AppController],
    providers: [AppService]
})

export class AppModule {}
