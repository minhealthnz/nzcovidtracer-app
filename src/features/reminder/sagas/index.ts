import { all, call } from "redux-saga/effects";

import { cancelReminders } from "../commonActions";
import { checkInAppReminders } from "./checkInAppReminders";
import { rescheduleReminders } from "./rescheduleReminders";
import { toggleRemindersEnabled } from "./toggleReminderEnabled";
import { updateReminderConfig } from "./updateReminderConfig";

export default function* watchSaga() {
  yield all([
    call(updateReminderConfig),
    call(rescheduleReminders),
    call(cancelReminders),
    call(checkInAppReminders),
    call(toggleRemindersEnabled),
  ]);
}
