import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import { cancelReminders as cancelAction } from "../commonActions";
import { cancelReminders as cancelFunction } from "../service/cancelReminders";

export function* cancelReminders(): SagaIterator {
  yield takeLatest([cancelAction], onCancelReminders);
}

function* onCancelReminders(): SagaIterator {
  yield call(cancelFunction);
}
