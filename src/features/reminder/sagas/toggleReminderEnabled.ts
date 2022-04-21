import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";

import {
  cancelReminders,
  rescheduleReminders as rescheduleAction,
  toggleIsRemindersEnabled,
} from "../commonActions";
import { toggleRemindersEnabled as toggleAction } from "../reducer";
import { selectIsEnabled } from "../selectors";

export function* toggleRemindersEnabled(): SagaIterator {
  yield takeLatest([toggleIsRemindersEnabled], onToggleReminderEnabled);
}

function* onToggleReminderEnabled(): SagaIterator {
  yield put(toggleAction());

  const isEnabled = yield select(selectIsEnabled);

  if (!isEnabled) {
    yield put(cancelReminders());
  } else {
    yield put(rescheduleAction());
  }
}
