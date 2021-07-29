import moment from "moment";

import { InAppReminder } from "../reducer";

export function getUpdatedInAppReminders(
  scheduledReminders: InAppReminder[],
):
  | { displayReminder: InAppReminder; updatedReminders: InAppReminder[] }
  | undefined {
  const sortedReminders = [...scheduledReminders].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );
  const now = moment();
  let newestIndexToDisplay = -1;
  for (let i = 0; i < sortedReminders.length; i++) {
    const diff = moment
      .duration(now.diff(sortedReminders[i].dateTime))
      .asSeconds();
    if (diff > -60) {
      newestIndexToDisplay = i;
    }
  }
  if (newestIndexToDisplay > -1) {
    return {
      displayReminder: sortedReminders[newestIndexToDisplay],
      updatedReminders: sortedReminders.slice(
        newestIndexToDisplay + 1,
        sortedReminders.length,
      ),
    };
  }
  return undefined;
}
