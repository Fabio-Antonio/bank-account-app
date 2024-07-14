import { Injectable } from '@nestjs/common';
import { IAccount } from '../interfaces/account.interfaces';
import { IAccountService } from '../services/account-service.interface';

@Injectable()
export class CreateAccountUseCase  {
    constructor(
    private readonly accountService: IAccountService,
  ) {}

  async execute(createAccountDto: IAccount): Promise<IAccount| null> {
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
      return null;
    }
    
  }
  
}