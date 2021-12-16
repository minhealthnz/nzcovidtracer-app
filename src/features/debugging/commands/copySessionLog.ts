import { getInstance } from "@logger/transports/session";
import Clipboard from "@react-native-community/clipboard";
import moment from "moment-timezone";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const copySessionLog: TestCommand = {
  command: "copySessionLog",
  title: "Copy session log",
  run() {
    const session = getInstance();
    if (session == null) {
      Alert.alert("session logs are not available");
      return;
    }

    const result = session.buffer
      .map(([date, level, name, message]) => {
        return `[${moment(
          date,
        ).format()}] [${level.toUpperCase()}] ${name}: ${message}`;
      })
      .join("\n");

    Clipboard.setString(result);

    Alert.alert("Copied logs to clipboard");
  },
};
