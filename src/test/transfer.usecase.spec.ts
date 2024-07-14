import { Test, TestingModule } from '@nestjs/testing';
import { TransferUseCase } from 'src/account/domain/usecases/transfer.usecase';
import { IAccountService } from 'src/account/domain/services/account-service.interface';
import { IAccount, ITransaction } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';

class MockAccountService {
  getAccount = jest.fn();
  accountMovement = jest.fn();
}

describe('TransferUseCase', () => {
  let transferUseCase: TransferUseCase;
  let accountService: IAccountService;

  const sourceAccount: Partial<IAccountDocument> = {
    _id: '123',
    accountNumber: '0001',
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
    }
  };

  const destinationAccount: Partial<IAccountDocument> = {
    _id: '456',
    accountNumber: '0002',
    owner: 'Jane Doe',
    balance: 500,
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
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferUseCase,
        {
          provide: IAccountService,
          useClass: MockAccountService,
        },
      ],
    }).compile();

    transferUseCase = module.get<TransferUseCase>(TransferUseCase);
    accountService = module.get<IAccountService>(IAccountService);
  });

  it('should be defined', () => {
    expect(transferUseCase).toBeDefined();
  });

  it('should transfer amount from source to destination account', async () => {
    const amount = 200;
    const updatedSourceAccount = { ...sourceAccount, balance: (sourceAccount?.balance || 0) - amount };
    const updatedDestinationAccount = { ...destinationAccount, balance: (destinationAccount?.balance || 0) + amount };

    const sourceTransaction: ITransaction = {
      type: 'transfer',
      amount,
      balanceAfterTransaction: updatedSourceAccount.balance,
      description: `Transfer to ${destinationAccount.accountNumber}`,
      date: new Date(),
    };

    const destinationTransaction: ITransaction = {
      type: 'transfer',
      amount,
      balanceAfterTransaction: updatedDestinationAccount.balance,
      description: `Transfer from ${sourceAccount.accountNumber}`,
      date: new Date(),
    };

    updatedSourceAccount?.transactions?.push(sourceTransaction);
    updatedDestinationAccount?.transactions?.push(destinationTransaction);

    jest.spyOn(accountService, 'getAccount')
      .mockResolvedValueOnce(sourceAccount as IAccount)
      .mockResolvedValueOnce(destinationAccount as IAccount);

    jest.spyOn(accountService, 'accountMovement')
      .mockResolvedValueOnce(updatedDestinationAccount as IAccount)
      .mockResolvedValueOnce(updatedSourceAccount as IAccount);

    const result = await transferUseCase.execute(sourceAccount._id!, destinationAccount._id!, amount);

    expect(accountService.getAccount).toHaveBeenCalledWith(sourceAccount._id!);
    expect(accountService.getAccount).toHaveBeenCalledWith(destinationAccount._id!);
    expect(accountService.accountMovement).toHaveBeenCalledWith(updatedDestinationAccount);
    expect(accountService.accountMovement).toHaveBeenCalledWith(updatedSourceAccount);
    expect(result).toEqual(updatedSourceAccount);
  });

  it('should return null if one or both accounts are not found', async () => {
    const amount = 200;

    jest.spyOn(accountService, 'getAccount')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(destinationAccount as IAccount);

    const result = await transferUseCase.execute(sourceAccount._id!, destinationAccount._id!, amount);

    expect(accountService.getAccount).toHaveBeenCalledWith(sourceAccount._id!);
    expect(accountService.getAccount).toHaveBeenCalledWith(destinationAccount._id!);
    expect(result).toBeNull();
  });

  it('should return null if source account has insufficient balance', async () => {
    const amount = 2000;

    jest.spyOn(accountService, 'getAccount')
      .mockResolvedValueOnce(sourceAccount as IAccount)
      .mockResolvedValueOnce(destinationAccount as IAccount);

    const result = await transferUseCase.execute(sourceAccount._id!, destinationAccount._id!, amount);

    expect(accountService.getAccount).toHaveBeenCalledWith(sourceAccount._id!);
    expect(accountService.getAccount).toHaveBeenCalledWith(destinationAccount._id!);
    expect(result).toBeNull();
  });
});
