import Clipboard from "@react-native-community/clipboard";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const copyMessagingToken: TestCommand = {
  command: "copyMessagingToken",
  title: "Copy firebase token",
  async run() {
    const token = await messaging().getToken();
    Clipboard.setString(token);
    Alert.alert("Copied to clipboard", token);
  },
};
