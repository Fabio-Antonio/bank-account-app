import { Injectable } from '@nestjs/common';
import { IAccount } from 'src/account/domain/interfaces/account.interfaces';
import { IAccountService } from 'src/account/domain/services/account-service.interface';
import { IAccountDocument } from 'src/account/infrastructure/schemas/account.schema';
import { AccountRepositoryImpl } from 'src/account/infrastructure/repositories/account.repository';

@Injectable()
export class AccountService extends IAccountService {
  constructor(
    private readonly accountRepository: AccountRepositoryImpl,
  ) {
    super();
  }

  public async createAccount(accountData: IAccount): Promise<IAccount | null> {
    // let session: ClientSession | undefined;
    try {
      // session = await this.accountRepository.startTransaction();

      const createdAccount = await this.accountRepository.create(accountData);

      if (createdAccount) {
        createdAccount?.auditLogs?.push({
          action: 'create_account',
          date: new Date(),
          details: `Account created for ${accountData.owner}`,
        });

        await this.accountRepository.save(createdAccount);

        // await session.commitTransaction();
        // session.endSession();

        return createdAccount;
      } else {
        throw new Error('Failed to create account.');
      }
    } catch (error) {
      /*if (session) {
        await session.abortTransaction();
        session.endSession();
      }*/
      console.error('Error creating account:', error);
      return null
    }
  }

  public async accountMovement(account: IAccount): Promise<IAccount | null> {
    //const session: ClientSession = await this.accountRepository.startTransaction();

    try {

      await this.accountRepository.save(account as IAccountDocument);

      //await session.commitTransaction();
      //session.endSession();

      return account;
    } catch (error) {
      // await session.abortTransaction();
      //session.endSession();
      console.error('Error depositing into account:', error);
      return null
    }
  }


  public async getAccount(accountId: string): Promise<IAccount | null> {
    try {
      const account = await this.accountRepository.findById(accountId);

      if (!account) {
        throw new Error('Account not found');
      }

      return account;
    } catch (error) {
      console.error('Error getting account:', error);
      return null
    }
  }


}
