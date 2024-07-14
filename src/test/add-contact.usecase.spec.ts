import { Test, TestingModule } from '@nestjs/testing';
import { IContact } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountService } from 'src/account/domain/services/account-service.interface';
import { AddContactAccountUseCase } from 'src/account/domain/usecases/add-contact-in-account.usecase';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';

describe('AddContactAccountUseCase', () => {
  let addContactAccountUseCase: AddContactAccountUseCase;
  let accountService: IAccountService;

  const mockAccount: Partial<IAccountDocument>= {
    _id: '1',
    accountNumber: '1234567890',
    owner: 'John Doe',
    balance: 1000,
    transactions: [],
    contacts: [],
    movements: [],
    auditLogs: [],
    userInfo: {
      address: {
        street: 'san juan 29',
        city: 'cdmx',
        state: 'cdmx',
        zipCode: '29009',
      },
      email: 'ing.fabio.a@gmail.com',
      phone: '+525513658263',
    },
  };

  const mockContact: IContact = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '123-456-7890',
    accountNumber: '987654321',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddContactAccountUseCase,
        {
          provide: IAccountService,
          useValue: {
            getAccount: jest.fn().mockResolvedValue(mockAccount),
            accountMovement: jest.fn().mockResolvedValue({ ...mockAccount, contacts: [mockContact] }),
          },
        },
      ],
    }).compile();

    addContactAccountUseCase = module.get<AddContactAccountUseCase>(AddContactAccountUseCase);
    accountService = module.get<IAccountService>(IAccountService);
  });

  it('should add contact to account and create a movement', async () => {
    const result = await addContactAccountUseCase.execute('1', mockContact);

    expect(accountService.getAccount).toHaveBeenCalledWith('1');
    expect(accountService.accountMovement).toHaveBeenCalled();
    expect(result?.contacts).toContainEqual(mockContact);
    expect(result?.movements).toContainEqual(expect.objectContaining({ type: 'updateAccount' }));
  });

  it('should return null if account not found', async () => {
    jest.spyOn(accountService, 'getAccount').mockResolvedValueOnce(null);

    const result = await addContactAccountUseCase.execute('1', mockContact);

    expect(result).toBeNull();
  });
});
