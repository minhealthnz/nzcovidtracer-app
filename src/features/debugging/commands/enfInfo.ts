import { Alert } from "react-native";
import DeviceInfo from "react-native-device-info";
import { ExposureContextValue } from "react-native-exposure-notification-service";

import { TestCommand } from "../testCommand";

export const enfInfo = (exposure: ExposureContextValue): TestCommand => ({
  command: "enfInfo",
  title: "Show ENF info",
  run() {
    const {
      supported,
      canSupport,
      enabled,
      isAuthorised,
      status,
      initialised,
      permissions,
    } = exposure;

    const appId = DeviceInfo.getBundleId();
    const appVersion = DeviceInfo.getVersion();

    Alert.alert(
      supported && canSupport ? "ENF is supported" : "ENF is not available",
      JSON.stringify({
        appId,
        appVersion,
        supported,
        canSupport,
        initialised,
        enabled,
        isAuthorised,
        permissions,
        status,
      }),
    );
  },
});
