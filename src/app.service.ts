import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    console.log('Checking MongoDB connection...');
    const isConnected = await this.checkConnection();
    if (isConnected) {
      console.log('Successfully connected to MongoDB');
    } else {
      console.error('Failed to connect to MongoDB');
    }
  }

  private async checkConnection(): Promise<boolean> {
    try {
      await this.connection.db.command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('Error pinging MongoDB:', error);
      return false;
    }
  }
}