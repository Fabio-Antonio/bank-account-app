import { Injectable } from '@nestjs/common';
import { IAccountService } from '../services/account-service.interface';
import { IAccount, IContact, IMovement } from '../interfaces/account.interfaces';
import { LoggerAction } from 'src/shared/domain/logger';
import { LogsType } from 'src/shared/domain/interfaces/common.interfaces';

@Injectable()
export class AddContactAccountUseCase {
    constructor(
        private readonly accountService: IAccountService,
        private readonly logger: LoggerAction
    ) { }

    async execute(accountId: string,
        contactDto: IContact): Promise<IAccount | null> {

        try {
            const account = await this.accountService.getAccount(accountId);

            if (!account) {
                throw new Error('Account not found');
            }


            account?.contacts?.push(contactDto);

            const movement: IMovement = {
                type: 'updateAccount',
                amount: 0,
                date: new Date(),
                description: `Added contact ${contactDto.name}`,
                balanceAfterMovement: account.balance,
            };

            account?.movements?.push(movement);

            return await this.accountService.accountMovement(account);
        } catch (error) {
            this.logger.log('AddContactAccountUseCase', LogsType.ERROR, error);
            return null;
        }


    }

}