import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/account/application/services/account.service';
import { AccountRepositoryImpl } from 'src/account/infrastructure/repositories/account.repository';
import { IAccount, ITransaction } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';

describe('AccountService', () => {
  let service: AccountService;
  let repository: AccountRepositoryImpl;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountRepositoryImpl,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockAccount as IAccountDocument),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepositoryImpl>(AccountRepositoryImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create an account successfully', async () => {
      jest.spyOn(repository, 'create').mockResolvedValueOnce(mockAccount as IAccountDocument);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockAccount as IAccountDocument);

      const result = await service.createAccount(mockAccount as IAccount);

      expect(repository.create).toHaveBeenCalledWith(mockAccount as IAccount);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        auditLogs: expect.arrayContaining([
          expect.objectContaining({ action: 'create_account' }),
        ]),
      }));
      expect(result).toEqual(mockAccount as IAccount);
    });

    it('should handle error if account creation fails', async () => {
      jest.spyOn(repository, 'create').mockResolvedValueOnce(null as any);

      const result = await service.createAccount(mockAccount as IAccount);

      expect(result).toBeNull();
    });
  });

  describe('accountMovement', () => {
    it('should save account movement successfully', async () => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockAccount as IAccountDocument);

      const result = await service.accountMovement(mockAccount as IAccount);

      expect(repository.save).toHaveBeenCalledWith(mockAccount as IAccountDocument);
      expect(result).toEqual(mockAccount as IAccount);
    });

    it('should handle error if account movement fails', async () => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error('Save failed'));

      const result = await service.accountMovement(mockAccount as IAccount);

      expect(result).toBeNull();
    });
  });

  describe('getAccount', () => {
    it('should get account by ID successfully', async () => {
      const result = await service.getAccount('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockAccount as IAccount);
    });

    it('should handle error if account not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      const result = await service.getAccount('1');

      expect(result).toBeNull();
    });
  });
});





