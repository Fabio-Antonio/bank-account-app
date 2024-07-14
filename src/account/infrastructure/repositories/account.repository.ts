import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { IAccountDocument } from '../schemas/account.schema';
import { MongooseRepository } from 'src/shared/infrastructure/mongoose/mongoose.repository';

@Injectable()
export class AccountRepositoryImpl extends MongooseRepository<IAccountDocument> {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<IAccountDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(accountModel, connection);
  }
}
