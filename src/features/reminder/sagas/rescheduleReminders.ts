import { addEntry } from "@features/diary/reducer";
import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import { cancelReminders } from "../service/cancelReminders";

export function* rescheduleReminders(): SagaIterator {
  yield takeLatest([addEntry.fulfilled], onRescheduleReminders);
}

function* onRescheduleReminders(): SagaIterator {
  yield call(cancelReminders);
}
