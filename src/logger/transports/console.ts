import { Transport } from "../types";

function createConsole(): Transport {
  return {
    log(level: string, name: string, message: string) {
      const formatted = `${name}: ${message}`;
      switch (level) {
        case "info":
          console.info(formatted); // eslint-disable-line no-console
          break;
        case "warn":
          console.warn(formatted); // eslint-disable-line no-console
          break;
        case "error":
          console.error(formatted); // eslint-disable-line no-console
          break;
      }
    },
  };
}

export { createConsole as console };
