import { createAction } from "@reduxjs/toolkit";

import { ReminderNotificationConfig } from "./reducer";

export const updateReminderNotificationConfig = createAction<
  ReminderNotificationConfig | undefined
>("reminder/updateReminderNotificationConfig");

export const cancelReminders = createAction<void>("reminder/cancelReminders");
