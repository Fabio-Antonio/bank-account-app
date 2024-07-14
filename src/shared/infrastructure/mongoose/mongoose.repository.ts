import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, ClientSession, Connection } from 'mongoose';

@Injectable()
export class MongooseRepository<T extends Document> {
  constructor(
    @InjectModel('dynamicModel') private readonly model: Model<T>,
    private readonly connection: Connection,
  ) {}

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async create(entity: Partial<T>, session?: ClientSession): Promise<T> {
    if (session) {
      return await this.model.create([entity], { session }).then((res: any[]) => res[0]);
    } else {
      return await this.model.create(entity);
    }
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async getAllWhere(params: any): Promise<T[]> {
    return this.model.find(params).exec();
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async save(document: T, options?: { session?: ClientSession }): Promise<T> {
    return document.save(options);
  }
}
