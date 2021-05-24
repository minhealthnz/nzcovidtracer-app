import { createChannel } from "@features/exposure/service/createChannel";
import PushNotification from "react-native-push-notification";

export const sendLocalNotification = async (message: string, type: string) => {
  const channelId = await createChannel();
  PushNotification.localNotification({
    message,
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
      type,
      isLocal: true,
    },
  });
};
