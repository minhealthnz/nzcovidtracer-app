import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";

import {
  cancelReminders,
  updateReminderNotificationConfig,
} from "../commonActions";
import {
  ReminderNotificationConfig,
  setReminderNotificationConfig,
} from "../reducer";
import { selectReminderNotificationConfig } from "../selectors";

export function* updateReminderConfig(): SagaIterator {
  yield takeLatest([updateReminderNotificationConfig], onUpdateReminderConfig);
}

function* onUpdateReminderConfig({
  payload,
}: PayloadAction<ReminderNotificationConfig | undefined>): SagaIterator {
  const config = yield select(selectReminderNotificationConfig);
  if (
    !payload ||
    !payload.notifications ||
    payload.notifications.length === 0
  ) {
    yield put(
      setReminderNotificationConfig({
        version: payload?.version || config.version,
        notifications: [],
      }),
    );
    yield put(cancelReminders());
    return;
  }

  if (payload.version > config.version) {
    yield put(setReminderNotificationConfig(payload));
  }
}
