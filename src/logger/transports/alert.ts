import { Alert } from "react-native";

import { Transport } from "../types";

export function alert(): Transport {
  return {
    log(level: string, name: string, message: string) {
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
