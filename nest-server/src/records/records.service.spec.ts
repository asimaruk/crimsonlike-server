import { Test } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { Model } from 'mongoose';
import { Record } from './record.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('RecordsService', () => {
    let service: RecordsService;
    let model: Model<Record>;

    const mockRecord = {
        uid: '1',
        name: 'Player #1',
        score: 4
    };

    const recordsArray = [
        {
            uid: '1',
            name: 'Player #1',
            score: 4
        },
        {
            uid: '2',
            name: 'Player #2',
            score: 36
        }
    ];

    beforeEach(async () => {
        const modelToken = getModelToken(Record.name);
        const module = await Test.createTestingModule({
            providers: [
                RecordsService,
                {
                    provide: modelToken,
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockRecord),
                        constructor: jest.fn().mockResolvedValue(mockRecord),
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        exec: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<RecordsService>(RecordsService);
        model = module.get<Model<Record>>(modelToken);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all records', async () => {
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(recordsArray)
        } as any);
        const records = await service.findAll();
        expect(records).toEqual(recordsArray);
    });

    it('should insert a new record', async () => {
        jest.spyOn(model, 'create').mockImplementationOnce(() =>
            Promise.resolve({
                uid: '1',
                name: 'Player #1',
                score: 4
            } as any)
        );
        const newRecord = await service.create({
            uid: '1',
            name: 'Player #1',
            score: 4
        });
        expect(newRecord).toEqual(mockRecord);
    });
});
