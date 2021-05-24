import { Alert } from "react-native";

import config from "../../config";
import { Transport } from "../types";

export function alert(): Transport {
  return {
    log(level: string, name: string, message: string) {
      if (config.HideLogs) {
        return;
      }
      switch (level) {
        case "error":
          Alert.alert("-- Dev only --", `${name}: ${message}`);
          break;
        default:
          break;
      }
    },
  };
}
