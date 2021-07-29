import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";

const { logInfo } = createLogger("reminder/createChannel");

export async function createChannel(): Promise<string> {
  const channelId = "nz.govt.covid.covidracer.reminder";
  const channelName = "Reminder notification channel";
  const channelDescription = "Reminder notification channel";

  if (Platform.OS === "ios") {
    return channelId;
  }

  const exists = await new Promise((resolve) => {
    PushNotification.channelExists(channelId, (value) => {
      resolve(value);
    });
  });

  if (exists) {
    logInfo("channel already exists");
    return channelId;
  }

  PushNotification.createChannel(
    {
      channelId,
      channelName,
      channelDescription,
      soundName: "default",
      importance: 3,
      vibrate: true,
    },
    () => {},
  );

  logInfo("channel created");
  return channelId;
}
