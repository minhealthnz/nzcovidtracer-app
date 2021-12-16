import { all, call } from "redux-saga/effects";

import { autoDismissInAppReminder } from "./autoDismissInAppReminder";
import { cancelReminders } from "./cancelReminders";
import { checkInAppReminders } from "./checkInAppReminders";
import { rescheduleReminders } from "./rescheduleReminders";
import { toggleRemindersEnabled } from "./toggleReminderEnabled";
import { updateReminderConfig } from "./updateReminderConfig";

export default function* watchSaga() {
  yield all([
    call(updateReminderConfig),
    call(rescheduleReminders),
    call(autoDismissInAppReminder),
    call(cancelReminders),
    call(checkInAppReminders),
    call(toggleRemindersEnabled),
  ]);
}
