import { Test, TestingModule } from '@nestjs/testing';
import { IAccount } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountService } from 'src/account/domain/services/account-service.interface';
import { CreateAccountUseCase } from 'src/account/domain/usecases/create-account.usecase';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';


describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let accountService: IAccountService;

  const mockAccount: Partial<IAccountDocument> = {
    _id: '1',
    accountNumber: '1234567890',
    owner: 'John Doe',
    balance: 1000,
    transactions: [],
    contacts: [],
    movements: [],
    auditLogs: [],
    userInfo: {
    "address": {
      "street": "san juan 29",
      "city": "cdmx",
      "state": "cdmx",
      "zipCode": "29009"
    },
    "email": "ing.fabio.a@gmail.com",
    "phone": "+525513658263"
  },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountUseCase,
        {
          provide: IAccountService,
          useValue: {
            createAccount: jest.fn().mockResolvedValue(mockAccount),
          },
        },
      ],
    }).compile();

    createAccountUseCase = module.get<CreateAccountUseCase>(CreateAccountUseCase);
    accountService = module.get<IAccountService>(IAccountService);
  });

  it('should create account successfully', async () => {
    const result = await createAccountUseCase.execute(mockAccount as IAccount);

    expect(accountService.createAccount).toHaveBeenCalledWith(expect.objectContaining({ owner: 'John Doe' }));
    expect(result).toEqual(mockAccount);
  });

  it('should handle error when account creation fails', async () => {
    jest.spyOn(accountService, 'createAccount').mockResolvedValueOnce(null);

    const result = await createAccountUseCase.execute(mockAccount as IAccount);

    expect(result).toBeNull();
  });
});