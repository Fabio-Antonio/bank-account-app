import { Injectable } from '@nestjs/common';
import { IAccount } from "../interfaces/account.interfaces";

@Injectable()
export abstract class IAccountService {
    abstract createAccount(createAccountDto: IAccount): Promise<IAccount | null>;
    abstract accountMovement(accountId: IAccount): Promise<IAccount | null>;
    abstract getAccount(accountId: string): Promise<IAccount | null>
}