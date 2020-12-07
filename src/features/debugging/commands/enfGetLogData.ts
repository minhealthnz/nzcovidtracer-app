import { TestCommand } from "@features/debugging/testCommand";
import { Alert } from "react-native";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfGetLogData = (exposure: ExposureContextValue): TestCommand => ({
  command: "enfGetLogData",
  title: "Get Log Data",
  async run() {
    const { getLogData } = exposure;
    const logData = await getLogData();
    Alert.alert("getLogData", JSON.stringify(logData, null, 2));
  },
});
