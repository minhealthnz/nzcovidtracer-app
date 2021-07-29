export const ReminderEvents = {
  ReminderNotificationOpened: "reminderNotificationOpened",
  ReminderViewDiaryPressed: "reminderViewDiaryPressed",
  ReminderManageNotificationsPressed: "reminderManageNotificationsPressed",
  ReminderDismissed: "reminderDismissed",
  ToggleReminders: "toggleReminders",
} as const;

export type ReminderEventPayloads = {
  [ReminderEvents.ReminderDismissed]: {
    attributes: {
      screen: "dashboard" | "diary";
    };
  };
  [ReminderEvents.ToggleReminders]: {
    attributes: {
      state: "on" | "off";
    };
  };
};
