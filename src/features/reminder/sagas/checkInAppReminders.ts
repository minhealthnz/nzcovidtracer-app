import { SagaIterator } from "redux-saga";
import { call, delay, put, select } from "redux-saga/effects";

import {
  InAppReminder,
  setCurrentlyDisplayedInAppReminder,
  setScheduledInAppReminders,
} from "../reducer";
import { selectScheduledInAppReminders } from "../selectors";
import { getUpdatedInAppReminders } from "../service/getUpdatedInAppReminders";

export function* checkInAppReminders(): SagaIterator {
  while (true) {
    const scheduledReminders: InAppReminder[] = yield select(
      selectScheduledInAppReminders,
    );
    const results = yield call(getUpdatedInAppReminders, scheduledReminders);
    if (results) {
      yield put(setCurrentlyDisplayedInAppReminder(results.displayReminder));
      yield put(setScheduledInAppReminders(results.updatedReminders));
    }
    yield delay(60000);
  }
}
