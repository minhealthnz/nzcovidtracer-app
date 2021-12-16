import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { cancelReminders as cancelAction } from "../commonActions";
import { clearScheduledInAppReminders, dismissInAppReminder } from "../reducer";
import { cancelReminders as cancelFunction } from "../service/cancelReminders";

export function* cancelReminders(): SagaIterator {
  yield takeLatest([cancelAction], onCancelReminders);
}

function* onCancelReminders(): SagaIterator {
  yield call(cancelFunction);
  yield put(clearScheduledInAppReminders());
  yield put(dismissInAppReminder());
}
