import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";

const { logInfo } = createLogger("exposure/createChannel");

export async function createChannel(): Promise<string> {
  const channelId = "nz.govt.covid19.covidtracer";
  const channelName = "Main App Channel";
  const channelDescription = "Main App Channel";

  if (Platform.OS === "ios") {
    return channelId;
  }

  const exists = await new Promise((resolve) => {
    PushNotification.channelExists(channelId, (value) => {
      resolve(value);
    });
  });

  if (exists) {
    logInfo("channel already exists, skipping...");
    return channelId;
  }

  /**
   * NOTE (will): without the channelExists check,
   * the react-native-push-notifications #createChannel crashes on some devices
   * for more info, see
   * https://appcenter.ms/orgs/rush-covid/apps/NZ-COVID-Tracer-RN-Android/crashes/errors/3851397608u/overview
   */
  PushNotification.createChannel(
    {
      // TODO
      // mNotificationChannel!!.setShowBadge(true)
      // mNotificationChannel!!.enableLights(true)
      // mNotificationChannel!!.lightColor = context.getColor(R.color.colorPrimary)
      // mNotificationChannel!!.lockscreenVisibility = Notification.VISIBILITY_PRIVATE
      channelId,
      channelName,
      channelDescription,
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    () => {},
  );

  logInfo("channel created!");

  return channelId;
}
