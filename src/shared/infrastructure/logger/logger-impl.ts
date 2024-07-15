import { Injectable, Logger } from '@nestjs/common';
import { LogsType } from 'src/shared/domain/interfaces/common.interfaces';
import { LoggerAction } from 'src/shared/domain/logger';

@Injectable()
export class LoggerImpl implements LoggerAction {
    log(id: string, logType: LogsType, data: unknown) {
        const log = new Logger(id);

        switch (logType) {
            case LogsType.INFO:
                log.log(data);
                break;
            case LogsType.WARN:
                log.warn(data);
                break;
            case LogsType.ERROR:
                log.error(data);
                break;
        }
    }
}