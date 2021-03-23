import { TestCommand } from "@features/debugging/testCommand";
import Clipboard from "@react-native-community/clipboard";
import { Alert } from "react-native";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfGetLogData = (exposure: ExposureContextValue): TestCommand => ({
  command: "enfGetLogData",
  title: "Get Log Data and close contacts",
  async run() {
    const { getLogData, getCloseContacts } = exposure;
    const logData = await getLogData();
    const contacts = await getCloseContacts();
    const output = JSON.stringify({ logData, contacts }, null, 2);
    Alert.alert("Copied to clipboard", output);
    Clipboard.setString(output);
  },
});
