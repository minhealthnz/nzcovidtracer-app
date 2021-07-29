import { addEntry } from "@features/diary/reducer";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import appConfig, { Feature } from "../../../config";
import { rescheduleReminders as rescheduleAction } from "../commonActions";
import { setScheduledInAppReminders } from "../reducer";
import {
  selectIsEnabled,
  selectReminderNotificationConfig,
} from "../selectors";
import { cancelReminders } from "../service/cancelReminders";
import { getInAppReminders } from "../service/getInAppReminders";
import { scheduleReminders } from "../service/scheduleReminders";

export function* rescheduleReminders(): SagaIterator {
  yield takeLatest(
    [addEntry.fulfilled, rescheduleAction],
    onRescheduleReminders,
  );
}

function* onRescheduleReminders(): SagaIterator {
  const config = yield select(selectReminderNotificationConfig);
  const isEnabled = yield select(selectIsEnabled);
  if (
    !isEnabled ||
    !config.notifications ||
    config.notifications.length === 0
  ) {
    return;
  }
  yield call(cancelReminders);
  yield call(scheduleReminders, config.notifications);
  if (!appConfig.Features.has(Feature.ReminderNotifications)) {
    return;
  }
  const inAppReminders = yield call(getInAppReminders, config);
  yield put(setScheduledInAppReminders(inAppReminders));
}
