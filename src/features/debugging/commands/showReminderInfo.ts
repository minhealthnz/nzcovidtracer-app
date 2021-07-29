import { ReduxState } from "@domain/types";
import { _storeRef } from "@lib/storeRefs";
import { Alert } from "react-native";
import PushNotification from "react-native-push-notification";

import { TestCommand } from "../testCommand";

export const showReminderInfo: TestCommand = {
  command: "showReminderInfo",
  title: "Show Reminder Notification Info",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found");
    }
    const state: ReduxState = store.getState();
    PushNotification.getScheduledLocalNotifications((notifications) => {
      let output = "Scheduled reminders:\n";
      state.reminder.scheduledInAppReminders.forEach((reminder) => {
        output += reminder.dateTime + "\n";
      });
      output += "\nScheduled notifications:\n";
      notifications.forEach((notification) => {
        output += notification.date + "\n";
      });
      Alert.alert("Reminders", output);
    });
  },
};
