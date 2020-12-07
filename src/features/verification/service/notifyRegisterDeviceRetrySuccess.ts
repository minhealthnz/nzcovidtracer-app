import { createChannel } from "@features/exposure/service/createChannel";
import PushNotification from "react-native-push-notification";

import { ENFSupportRetrySuccess } from "../types";

export const notifyRegisterDeviceRetrySuccess = async () => {
  const channelId = await createChannel();
  PushNotification.localNotification({
    // TODO: Translate
    message:
      "Your device supports Bluetooth tracing! Help contact tracers by tapping here to enable it.",
    number: 1,
    soundName: "default",

    // Android
    channelId,
    onlyAlertOnce: false,
    largeIcon: "ic_launcher",
    // TODO verify
    smallIcon: "ic_notification",
    autoCancel: true,
    vibrate: true,
    priority: "default",
    // TODO title
    userInfo: {
      type: ENFSupportRetrySuccess,
      isLocal: true,
    },
  });
};
