import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const model = DeviceInfo.getModel();
const deviceId = DeviceInfo.getDeviceId();
export const isX = model.includes("iPhone X") || deviceId.includes("iPhone12");

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const isNetworkError = (err: any) => !!err.isAxiosError && !err.response;

export const isSmallScreen = (width: number) => width <= 360 || false;
