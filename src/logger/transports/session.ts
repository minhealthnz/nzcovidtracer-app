import { Transport } from "@logger/types";

export const createSession = (maxSize: number = 1000): Transport => {
  if (transport != null) {
    return transport;
  }
  transport = _createSession(maxSize);
  return transport;
};

let transport: ReturnType<typeof _createSession> | undefined;

const _createSession = (maxSize: number) => {
  const buffer: [Date, string, string, string][] = [];

  return {
    log(level: string, name: string, message: string) {
      buffer.push([new Date(), level, name, message]);
      if (buffer.length > maxSize) {
        // TODO needs performance improvements
        buffer.shift();
      }
    },
    get buffer() {
      return buffer;
    },
  };
};

export const getInstance = () => {
  return transport;
};
