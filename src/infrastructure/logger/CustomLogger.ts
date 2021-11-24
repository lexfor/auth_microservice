import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { sendFile } from '../aws/sendS3File';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly fileName;
  private readonly filePath;
  private readonly fd: number;
  constructor(name = 'Module') {
    super();
    this.fileName = `Source:${name}StartDate:${new Date().toISOString()}`;
    this.filePath = `./logs/`;
    this.fd = fs.openSync(`${this.filePath}${this.fileName}`, 'a');
  }

  log(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Logs: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
  async error(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Error: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
    await sendFile(this.fileName, this.filePath);
  }
  warn(message: any, ...optionalParams: any[]) {
    fs.writeSync(
      this.fd,
      `Warning: ${message}\n Module: ${optionalParams.toString()}\n`,
    );
  }
}
