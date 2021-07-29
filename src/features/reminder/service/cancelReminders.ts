import { createLogger } from "@logger/createLogger";
import PushNotification from "react-native-push-notification";

const { logInfo } = createLogger("reminder/cancelReminders");

export async function cancelReminders() {
  logInfo("cancelling scheduled reminders");
  await new Promise((resolve) => {
    PushNotification.getScheduledLocalNotifications((notifications) => {
      notifications.forEach((notification) => {
        PushNotification.cancelLocalNotifications({
          id: notification.id.toString(),
        });
      });
      resolve();
    });
  });
}
