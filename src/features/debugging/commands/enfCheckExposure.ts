import { TestCommand } from "@features/debugging/testCommand";
import { Alert } from "react-native";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfCheckExposure = (
  exposure: ExposureContextValue,
): TestCommand => ({
  command: "enfCheckExposure",
  title: "Check Exposure",
  async run() {
    const { checkExposure } = exposure;
    checkExposure(true, false);
    Alert.alert("checkExposure", "Done");
  },
});
