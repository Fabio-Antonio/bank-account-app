import { Injectable } from '@nestjs/common';
import { IAccountService } from '../services/account-service.interface';
import { IAccount, ITransaction } from '../interfaces/account.interfaces';

@Injectable()
export class TransferUseCase {
    constructor(
        private readonly accountService: IAccountService,
    ) { }

    async execute(sourceAccountId: string, destinationAccountId: string, amount: number): Promise<IAccount | null> {

        try {
            const sourceAccount = await this.accountService.getAccount(sourceAccountId);
            const destinationAccount = await this.accountService.getAccount(destinationAccountId);

            if (!sourceAccount || !destinationAccount) {
                throw new Error('One or both accounts not found');
            }

            if (sourceAccount.balance < amount) {
                throw new Error('Insufficient balance in source account');
            }

            sourceAccount.balance -= amount;
            const sourceTransaction: ITransaction = {
                type: 'transfer',
                amount,
                balanceAfterTransaction: sourceAccount.balance,
                description: `Transfer to ${destinationAccountId}`,
                date: new Date()
            };
            sourceAccount?.transactions?.push(sourceTransaction);

            // Update destination account
            destinationAccount.balance += amount;
            const destinationTransaction: ITransaction = {
                type: 'transfer',
                amount,
                balanceAfterTransaction: destinationAccount.balance,
                description: `Transfer from ${sourceAccountId}`,
                date: new Date()
            };
            destinationAccount?.transactions?.push(destinationTransaction);
            await this.accountService.accountMovement(destinationAccount);
            return await this.accountService.accountMovement(sourceAccount)
        } catch (error) {
            return null;
        }


    }

}

