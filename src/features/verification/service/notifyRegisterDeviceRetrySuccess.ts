import { sendLocalNotification } from "../../../sendLocalNotification";
import { ENFSupportRetrySuccess } from "../types";

export const notifyRegisterDeviceRetrySuccess = async () => {
  await sendLocalNotification(
    "Your device supports Bluetooth tracing! Help contact tracers by tapping here to enable it.",
    ENFSupportRetrySuccess,
  );
};
