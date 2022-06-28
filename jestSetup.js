import "./node_modules/react-native-gesture-handler/jestSetup.js";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-native-device-info", () => ({
  getModel: () => "",
  getDeviceId: () => "",
}));

jest.mock("./src/db/create");

jest.mock("./src/logger/createTransports");

jest.mock("react-native-config");

jest.mock("react-native-exposure-notification-service", () => {});

jest.mock("react-native-bluetooth-state-manager", () => {});

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
}));

global.WebSocket = jest.fn();
