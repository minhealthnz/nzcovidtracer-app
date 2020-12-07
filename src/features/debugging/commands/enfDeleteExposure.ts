import { TestCommand } from "@features/debugging/testCommand";
import { Alert } from "react-native";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfDeleteExposure = (
  exposure: ExposureContextValue,
): TestCommand => ({
  command: "enfDeleteExposure",
  title: "Delete exposure data",
  async run() {
    const { deleteExposureData } = exposure;
    await deleteExposureData();
    Alert.alert("deleteExposureData", "Done");
  },
});
