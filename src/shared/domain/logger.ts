import { Injectable } from '@nestjs/common';
import { LogsType } from './interfaces/common.interfaces';

@Injectable()
export abstract class LoggerAction {
  abstract log(id: string, logType: LogsType, data: unknown): void;
}
