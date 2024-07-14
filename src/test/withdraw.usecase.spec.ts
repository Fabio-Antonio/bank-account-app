import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawUseCase } from 'src/account/domain/usecases/withdraw.usecase';
import { IAccountService } from 'src/account/domain/services/account-service.interface';
import { IAccount, ITransaction } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';

class MockAccountService {
  getAccount = jest.fn();
  accountMovement = jest.fn();
}

describe('WithdrawUseCase', () => {
  let withdrawUseCase: WithdrawUseCase;
  let accountService: IAccountService;

  const mockAccount: Partial<IAccountDocument> = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawUseCase,
        {
          provide: IAccountService,
          useClass: MockAccountService,
        },
      ],
    }).compile();

    withdrawUseCase = module.get<WithdrawUseCase>(WithdrawUseCase);
    accountService = module.get<IAccountService>(IAccountService);
  });

  it('should be defined', () => {
    expect(withdrawUseCase).toBeDefined();
  });

  it('should withdraw amount from account', async () => {
    const amount = 500;
const updatedAccount = { ...mockAccount, balance: (mockAccount?.balance || 0) - amount };    const transaction: ITransaction = {
      type: 'withdraw',
      amount,
      balanceAfterTransaction: updatedAccount.balance,
      description: 'Withdrawal transaction',
      date: new Date(),
    };
    updatedAccount?.transactions?.push(transaction);

    jest.spyOn(accountService, 'getAccount').mockResolvedValue(mockAccount as IAccount);
    jest.spyOn(accountService, 'accountMovement').mockResolvedValue(updatedAccount as IAccount);

    const result = await withdrawUseCase.execute(mockAccount._id!, amount);

    expect(accountService.getAccount).toHaveBeenCalledWith(mockAccount._id!);
    expect(accountService.accountMovement).toHaveBeenCalledWith(updatedAccount);
    expect(result).toEqual(updatedAccount);
  });

  it('should return null if account not found', async () => {
    const amount = 500;

    jest.spyOn(accountService, 'getAccount').mockResolvedValue(null);

    const result = await withdrawUseCase.execute(mockAccount._id!, amount);

    expect(accountService.getAccount).toHaveBeenCalledWith(mockAccount._id!);
    expect(result).toBeNull();
  });
});
