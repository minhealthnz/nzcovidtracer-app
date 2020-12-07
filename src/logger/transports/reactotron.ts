import reactotron from "../../../reactotronConfig";
import { Transport } from "../types";

export function createReactotron(): Transport {
  return {
    log(level: string, name: string, message: string) {
      const formatted = `${name}: ${message}`;
      switch (level) {
        case "info":
          reactotron.log?.("INFO", formatted);
          break;
        case "warn":
          reactotron.log?.("WARN", formatted);
          break;
        case "error":
          reactotron.log?.("ERROR", formatted);
          break;
      }
    },
  };
}

export { createReactotron as reactotron };
