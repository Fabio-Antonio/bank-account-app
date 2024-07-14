
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountRepositoryImpl } from '../infrastructure/repositories/account.repository';
import { IAccount } from '../domain/interfaces/account.interfaces';
import { IContact, IMovement } from '../domain/interfaces/account.interfaces';
import { CreateAccountUseCase } from '../domain/usecases/create-account.usecase';
import { AddContactAccountUseCase } from '../domain/usecases/add-contact-in-account.usecase';
import { DepositUseCase } from '../domain/usecases/deposit.usecase';
import { WithdrawUseCase } from '../domain/usecases/withdraw.usecase';
import { TransferUseCase } from '../domain/usecases/transfer.usecase';

// Mock del repositorio de cuentas
class MockAccountRepository {
  create(accountData: IAccount): Promise<IAccount | null> {
    // Implementación de mock para crear cuenta
    return Promise.resolve({
      ...accountData,
      _id: 'mockedAccountId',
    });
  }

  findById(accountId: string): Promise<IAccount | null> {
    // Implementación de mock para encontrar cuenta por ID
    return Promise.resolve({
      _id: accountId,
      accountNumber: '123456789',
      owner: 'Mocked Owner',
      balance: 1000,
      transactions: [],
      contacts: [],
      movements: [],
      auditLogs: [],
      userInfo: {},
    });
  }

  save(account: IAccount): Promise<IAccount | null> {
    // Implementación de mock para guardar cuenta
    return Promise.resolve(account);
  }
}

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: MockAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        CreateAccountUseCase,
        AddContactAccountUseCase,
        DepositUseCase,
        WithdrawUseCase,
        TransferUseCase,
        { provide: AccountRepositoryImpl, useClass: MockAccountRepository },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepositoryImpl>(AccountRepositoryImpl);
  });

  it('should create an account', async () => {
    const newAccountData: IAccount = {
      accountNumber: '987654321',
      owner: 'Test Owner',
      balance: 0,
      transactions: [],
      contacts: [],
      movements: [],
      auditLogs: [],
      userInfo: {},
    };

    const createdAccount = await service.createAccount(newAccountData);

    expect(createdAccount).toBeDefined();
    expect(createdAccount?.accountNumber).toBe('987654321');
    expect(createdAccount?._id).toBe('mockedAccountId');
  });

  it('should add a contact to an account', async () => {
    const accountId = 'mockedAccountId';
    const newContact: IContact = {
      name: 'New Contact',
      email: 'contact@example.com',
    };

    const updatedAccount = await service.addContact(accountId, newContact);

    expect(updatedAccount).toBeDefined();
    expect(updatedAccount?.contacts?.length).toBe(1);
    expect(updatedAccount?.contacts?.[0].name).toBe('New Contact');
  });

  // Otros casos de uso y pruebas similares para depositar, retirar, transferir, etc.

  afterEach(() => {
    jest.clearAllMocks();
  });
});