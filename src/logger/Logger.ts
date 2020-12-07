import { Transport } from "./types";

export interface LoggerParams {
  name: string;
  transports: ReadonlyArray<Transport>;
}

export class Logger {
  private transports: ReadonlyArray<Transport>;
  private name: string;
  constructor(params: LoggerParams) {
    this.transports = params.transports;
    this.name = params.name;
  }

  log(level: string, message: string) {
    for (const transport of this.transports) {
      transport.log(level, this.name, message);
    }
  }

  logInfo(message: string) {
    this.log("info", message);
  }

  logWarning(message: string) {
    this.log("warn", message);
  }

  logError(error: string) {
    this.log("error", error);
  }
}
