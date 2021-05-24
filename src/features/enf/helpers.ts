import {
  Status,
  StatusState,
  StatusType,
} from "react-native-exposure-notification-service";

export const isBluetoothDisabled = (status: Status) =>
  status.state === StatusState.disabled &&
  status.type?.includes(StatusType.bluetooth);
