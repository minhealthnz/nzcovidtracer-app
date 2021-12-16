import { createLogger } from "@logger/createLogger";
import moment from "moment-timezone";
import PushNotification from "react-native-push-notification";

import config, { Feature } from "../../../config";
import { ReminderNotificationId } from "../consts";
import { ReminderNotification } from "../reducer";
import { cancelReminders } from "./cancelReminders";
import { createChannel } from "./createChannel";

const { logInfo } = createLogger("reminder/scheduleReminders");

export const ReminderNotificationType = "Reminder";

export async function scheduleReminders(notifications: ReminderNotification[]) {
  if (!config.Features.has(Feature.ReminderNotifications)) {
    logInfo("no feature flag for ReminderNotification -> abort");
    await cancelReminders();
    return;
  }
  logInfo("getting channel id");

  const channelId = await createChannel();

  notifications.forEach((notification, index) => {
    logInfo(
      `scheduling notification for ${notification.timingInMinutes} minutes from now`,
    );
    PushNotification.localNotificationSchedule({
      channelId,
      id: ReminderNotificationId + index,
      message: notification.notificationMessage,
      date: moment().add(notification.timingInMinutes, "minutes").toDate(),
      userInfo: {
        id: ReminderNotificationId.toString(),
        type: ReminderNotificationType,
        isLocal: true,
      },
    });
  });
}
