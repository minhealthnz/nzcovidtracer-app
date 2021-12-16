import moment from "moment-timezone";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const model = DeviceInfo.getModel();
const deviceId = DeviceInfo.getDeviceId();
export const isX = model.includes("iPhone X") || deviceId.includes("iPhone12");

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const isNetworkError = (err: any) => !!err.isAxiosError && !err.response;

export const isSmallScreen = (width: number) => width <= 360 || false;

export const isOutsideNZ = () => {
  const tz = moment.tz.guess();
  return !(tz && tz.includes("Auckland"));
};

export const getOffsetInMins = () => {
  if (isOutsideNZ()) {
    const nzOffset = moment().tz("Pacific/Auckland").utcOffset();
    const currentOffset = -new Date().getTimezoneOffset();
    return currentOffset - nzOffset;
  }

  return 0;
};
