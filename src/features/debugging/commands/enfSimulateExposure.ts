import { TestCommand } from "@features/debugging/testCommand";
import { Alert, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfSimulateExposure = (
  exposure: ExposureContextValue,
): TestCommand => ({
  command: "enfSimulateExposure",
  title: "Simulate exposure",
  async run() {
    if (Platform.OS === "android") {
      const version = await DeviceInfo.getApiLevel();
      if (version < 26) {
        Alert.alert(
          "Simulate exposure option is not supported for API level < 26",
        );
        return;
      }
    }
    exposure.simulateExposure(0);
  },
});
