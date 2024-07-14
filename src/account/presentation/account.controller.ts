import { Controller, Post, Patch, Body, Get, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBody, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAccountUseCase } from '../domain/usecases/create-account.usecase';
import { IAccount } from '../domain/interfaces/account.interfaces';
import { CreateAccountDto } from '../application/dtos/account.dto';
import { DepositUseCase } from '../domain/usecases/deposit.usecase';
import { WithdrawUseCase } from '../domain/usecases/withdraw.usecase';
import { IAccountService } from '../domain/services/account-service.interface';
import { TransferUseCase } from '../domain/usecases/transfer.usecase';
import { AddContactAccountUseCase } from '../domain/usecases/add-contact-in-account.usecase';
import { ContactDto } from '../application/dtos/contact.dto';
import { JwtAuthGuard } from 'src/shared/infrastructure/jwt/auth-gard';

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly transferUseCase: TransferUseCase,
    private readonly service: IAccountService,
    private readonly addContactAccountUseCase: AddContactAccountUseCase
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post(':id/deposit')
  @ApiParam({ name: 'id', type: String, description: 'ID de la cuenta' })
  @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number', example: 100 } } } })
  @ApiResponse({ status: 200, description: 'Depósito exitoso', type: CreateAccountDto })
  @ApiResponse({ status: 400, description: 'Monto debe ser mayor que cero' })
  async deposit(@Param('id') id: string, @Body('amount') amount: number): Promise<IAccount | null> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.depositUseCase.execute(id, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/withdraw')
  @ApiParam({ name: 'id', type: String, description: 'ID de la cuenta' })
  @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number', example: 100 } } } })
  @ApiResponse({ status: 200, description: 'Retiro exitoso', type: CreateAccountDto })
  @ApiResponse({ status: 400, description: 'Monto debe ser mayor que cero' })
  async withdraw(@Param('id') id: string, @Body('amount') amount: number): Promise<IAccount | null> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.withdrawUseCase.execute(id, amount);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Detalles de la cuenta', type: CreateAccountDto })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async getAccount(@Param('id') id: string): Promise<IAccount | null> {
    return this.service.getAccount(id);
  }


  /*@Get(':id/transactions')
  async getTransactions(@Param('id') id: string) {
    return await this.accountService.getTransactions(id);
  }*/
  @UseGuards(JwtAuthGuard)
  @Post('transfer/:sourceAccountId/:destinationAccountId')
  @ApiParam({ name: 'sourceAccountId', type: String, description: 'ID de la cuenta fuente' })
  @ApiParam({ name: 'destinationAccountId', type: String, description: 'ID de la cuenta destino' })
  @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number', example: 100 } } } })
  @ApiResponse({ status: 200, description: 'Transferencia exitosa', type: CreateAccountDto })
  @ApiResponse({ status: 400, description: 'Balance insuficiente en la cuenta fuente' })
  @ApiResponse({ status: 404, description: 'Una o ambas cuentas no se encontraron' })
  async transfer(
    @Param('sourceAccountId') sourceAccountId: string,
    @Param('destinationAccountId') destinationAccountId: string,
    @Body('amount') amount: number
  ): Promise<IAccount | null> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
    return await this.transferUseCase.execute(sourceAccountId, destinationAccountId, amount)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Cuenta creada exitosamente', type: CreateAccountDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<IAccount | null> {
    return await this.createAccountUseCase.execute(createAccountDto as IAccount)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/contact')
  @ApiOperation({ summary: 'Add a contact to an account' })
  @ApiResponse({
    status: 200,
    description: 'Contact added successfully',
    type: CreateAccountDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiBody({ type: ContactDto })
  async addContact(
    @Param('id') id: string,
    @Body() contactDto: ContactDto,
  ): Promise<IAccount | null> {
    if (!contactDto.name || !contactDto.accountNumber) {
      throw new BadRequestException('Contact name and account number are required');
    }

    return await this.addContactAccountUseCase.execute(id, contactDto);
  }

}