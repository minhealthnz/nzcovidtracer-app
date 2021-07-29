import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { toggleIsRemindersEnabled } from "../commonActions";
import { rescheduleReminders as rescheduleAction } from "../commonActions";
import {
  dismissInAppReminder,
  setScheduledInAppReminders,
  toggleRemindersEnabled as toggleAction,
} from "../reducer";
import { selectIsEnabled } from "../selectors";
import { cancelReminders } from "../service/cancelReminders";

export function* toggleRemindersEnabled(): SagaIterator {
  yield takeLatest([toggleIsRemindersEnabled], onToggleReminderEnabled);
}

function* onToggleReminderEnabled(): SagaIterator {
  yield put(toggleAction());

  const isEnabled = yield select(selectIsEnabled);

  if (!isEnabled) {
    yield call(cancelReminders);
    yield put(setScheduledInAppReminders([]));
    yield put(dismissInAppReminder());
  } else {
    yield put(rescheduleAction());
  }
}
