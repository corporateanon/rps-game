import { injectable } from 'inversify';
import { Logger } from './Logger';

@injectable()
export class LoggerImpl_Console implements Logger {
    log(message: string): void {
        console.log(message);
    }
}
