import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { accountSchema} from '../infrastructure/schemas/account.schema';
import { IAccountService } from '../domain/services/account-service.interface';
import { AccountService } from '../application/services/account.service';
import { CreateAccountUseCase } from '../domain/usecases/create-account.usecase';
import { DepositUseCase } from '../domain/usecases/deposit.usecase';
import { TransferUseCase } from '../domain/usecases/transfer.usecase';
import { WithdrawUseCase } from '../domain/usecases/withdraw.usecase';
import { AccountRepositoryImpl } from '../infrastructure/repositories/account.repository';
import { AddContactAccountUseCase } from '../domain/usecases/add-contact-in-account.usecase';
import { SharedModule } from 'src/shared/presentation/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: accountSchema }]),
    SharedModule
  ],
  controllers: [AccountController],
  providers: [
    { provide: IAccountService, useClass: AccountService },
    CreateAccountUseCase,
    DepositUseCase,
    TransferUseCase,
    WithdrawUseCase,
    AddContactAccountUseCase,
    AccountRepositoryImpl,

  ],
})
export class AccountModule { }