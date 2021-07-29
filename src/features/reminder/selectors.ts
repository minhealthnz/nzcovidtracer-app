import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectReminder = (state: ReduxState) => state.reminder;

export const selectReminderNotificationConfig = createSelector(
  selectReminder,
  (reminder) => reminder.config,
);

export const selectScheduledInAppReminders = createSelector(
  selectReminder,
  (reminder) => reminder.scheduledInAppReminders,
);

export const selectCurrentlyDisplayedInAppReminder = createSelector(
  selectReminder,
  (reminder) => reminder.currentlyDisplayedInAppReminder,
);

export const selectHasInAppReminder = createSelector(
  selectReminder,
  (reminder) => !!reminder.currentlyDisplayedInAppReminder,
);

export const selectIsEnabled = createSelector(
  selectReminder,
  (reminder) => reminder.isRemindersEnabled,
);
