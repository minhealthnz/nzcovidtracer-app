import { createAction } from "@reduxjs/toolkit";

import { ReminderNotificationConfig } from "./reducer";

export const updateReminderNotificationConfig = createAction<
  ReminderNotificationConfig | undefined
>("reminder/updateReminderNotificationConfig");

export const rescheduleReminders = createAction<void>(
  "reminder/rescheduleReminders",
);

export const cancelReminders = createAction<void>("reminder/cancelReminders");

export const toggleIsRemindersEnabled = createAction<void>(
  "reminder/toggleIsEnabled",
);
