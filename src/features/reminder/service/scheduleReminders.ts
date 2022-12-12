import { cancelReminders } from "./cancelReminders";

export const ReminderNotificationType = "Reminder";

export async function scheduleReminders() {
  await cancelReminders();
}
