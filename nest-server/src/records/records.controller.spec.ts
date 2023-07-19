import { Test } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './record.dto';

describe('RecordsController', () => {
    let controller: RecordsController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [RecordsController],
            providers: [
                {
                    provide: RecordsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([
                            {
                                uid: '1',
                                name: 'Player #1',
                                score: 4
                            },
                            {
                                uid: '2',
                                name: 'Player #2',
                                score: 36
                            },
                            {
                                uid: '3',
                                name: 'Player #3',
                                score: 33
                            }
                        ]),
                        create: jest.fn().mockImplementation((createRecordDto: CreateRecordDto) =>
                            Promise.resolve({ _id: '1', ...createRecordDto })
                        )
                    }
                }
            ]
        }).compile();

        controller = module.get<RecordsController>(RecordsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create()', () => {
        it('should create a new record', async () => {
            const createRecordDto: CreateRecordDto = {
                uid: '1',
                name: 'Player #1',
                score: 4
            };

            expect(controller.create(createRecordDto)).resolves.toEqual({ _id: '1', ...createRecordDto });
        });
    });

    describe('findAll()', () => {
        it('should get an array of records', () => {
            expect(controller.findAll()).resolves.toEqual([
                {
                    uid: '1',
                    name: 'Player #1',
                    score: 4
                },
                {
                    uid: '2',
                    name: 'Player #2',
                    score: 36
                },
                {
                    uid: '3',
                    name: 'Player #3',
                    score: 33
                }
            ]);
        });
    });
});
