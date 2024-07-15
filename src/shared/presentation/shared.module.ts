import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../infrastructure/jwt/jwt.stratergy';
import { AuthService } from '../aplication/services/auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../infrastructure/jwt/auth-gard';
import { LoggerAction } from '../domain/logger';
import { LoggerImpl } from '../infrastructure/logger/logger-impl';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, {provide: LoggerAction, useClass: LoggerImpl}],
  exports: [AuthService, JwtAuthGuard, JwtModule, LoggerAction],
})
export class SharedModule {}
