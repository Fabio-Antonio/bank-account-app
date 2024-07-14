import { Injectable } from '@nestjs/common';
import { IAccountService } from '../services/account-service.interface';
import { IAccount, ITransaction } from '../interfaces/account.interfaces';

@Injectable()
export class DepositUseCase {
    constructor(
        private readonly accountService: IAccountService,
    ) { }

    async execute(acoountId: string, amount: number): Promise<IAccount | null> {

        try {
            const account = await this.accountService.getAccount(acoountId);

            if (!account) {
                throw new Error('Account not found');
            }

            account.balance += amount;

            const transaction: ITransaction = {
                type: 'deposit',
                amount,
                balanceAfterTransaction: account.balance,
                description: 'Deposit transaction',
                date: new Date()
            };

            account?.transactions?.push(transaction);

            return await this.accountService.accountMovement(account);
        } catch (error) {
            return null;
        }


    }

}