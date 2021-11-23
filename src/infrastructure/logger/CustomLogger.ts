import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly fd: number;
  constructor(name = 'Module') {
    super();
    this.fd = fs.openSync(
      `./logs/Source:${name}StartDate:${new Date().toISOString()}`,
      'a',
    );
  }

  log(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Logs: ${message}\n Module: ${optionalParams.toString()}\n`,
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
}
