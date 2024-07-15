import { Injectable } from '@nestjs/common';
import { IAccount } from '../interfaces/account.interfaces';
import { IAccountService } from '../services/account-service.interface';
import { LoggerAction } from 'src/shared/domain/logger';
import { LogsType } from 'src/shared/domain/interfaces/common.interfaces';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountService: IAccountService,
    private readonly logger: LoggerAction
  ) { }

  async execute(createAccountDto: IAccount): Promise<IAccount | null> {
    try {
      const newAccount = {
        accountNumber: createAccountDto.accountNumber,
        owner: createAccountDto.owner,
        balance: createAccountDto.balance || 0,
        transactions: [],
        contacts: [],
        movements: [],
        auditLogs: [],
        userInfo: createAccountDto.userInfo,
      };
      return await this.accountService.createAccount(newAccount);
    } catch (error) {
      this.logger.log('CreateAccountUseCase', LogsType.ERROR, error);
      return null;
    }

  }

}