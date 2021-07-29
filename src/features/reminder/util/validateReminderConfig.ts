import { createLogger } from "@logger/createLogger";
import _ from "lodash";
import * as yup from "yup";

import { ReminderNotification, ReminderNotificationConfig } from "../reducer";

const { logError } = createLogger("reminder/validateReminderConfig");

const reminderNotificationSchema = yup
  .object<ReminderNotification>()
  .notRequired()
  .shape({
    timingInMinutes: yup.number().required(),
    notificationMessage: yup.string().required(),
    dashboardBody: yup.string().required(),
    dashboardTitle: yup.string().required(),
    diaryBody: yup.string().required(),
    diaryTitle: yup.string().required(),
  });

const reminderNotificationsSchema = yup.array().of(reminderNotificationSchema);

const emptyConfig: ReminderNotificationConfig = {
  version: -1,
  notifications: [],
};

export const validateReminderNotificationConfig = (
  payload: ReminderNotificationConfig | undefined,
) => {
  if (!payload) {
    return undefined;
  }
  if (typeof payload !== "object") {
    return undefined;
  }
  if (!("version" in payload) || typeof payload.version !== "number") {
    return undefined;
  }
  if (!("notifications" in payload) || !Array.isArray(payload.notifications)) {
    return { ...emptyConfig, version: payload.version };
  }

  try {
    const notifications = _.compact(
      reminderNotificationsSchema.cast(payload.notifications),
    );
    return { ...payload, notifications };
  } catch (err) {
    logError("Failed to parse reminder notifications");
    return undefined;
  }
};
