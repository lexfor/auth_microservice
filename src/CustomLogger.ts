import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';

export class CustomLogger implements LoggerService {
  private readonly fd: number;
  constructor() {
    this.fd = fs.openSync(`./logs/Start:${new Date().toISOString()}`, 'a');
  }
  log(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `$Logs: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
  error(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Error: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
  warn(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Warning: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
  debug?(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Debug: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
  verbose?(message: any, ...optionalParams: any[]) {}
}
