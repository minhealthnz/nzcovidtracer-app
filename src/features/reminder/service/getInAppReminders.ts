import moment from "moment-timezone";

import { InAppReminder, ReminderNotificationConfig } from "../reducer";

export function getInAppReminders(
  config: ReminderNotificationConfig,
): InAppReminder[] {
  const result: InAppReminder[] = [];
  config.notifications?.forEach((notification) => {
    result.push({
      dateTime: moment().add(notification.timingInMinutes, "minutes").toDate(),
      dashboardBody: notification.dashboardBody,
      dashboardTitle: notification.dashboardTitle,
      diaryTitle: notification.diaryTitle,
      diaryBody: notification.diaryBody,
    });
  });
  return result;
}
