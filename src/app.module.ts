import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from 'src/account/presentation/account.module';
import { SharedModule } from './shared/presentation/shared.module';
import { AppService } from './app.service';
import { JwtAuthMiddleware } from './shared/infrastructure/jwt/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
      SharedModule,
    AccountModule, 
    // Make sure this is correctly imported and not causing issues
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { 
}