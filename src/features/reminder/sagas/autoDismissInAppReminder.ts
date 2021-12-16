import { addEntry } from "@features/diary/reducer";
import { SagaIterator } from "redux-saga";
import { put, takeLatest } from "redux-saga/effects";

import { dismissInAppReminder } from "../reducer";

export function* autoDismissInAppReminder(): SagaIterator {
  yield takeLatest([addEntry.fulfilled], onAutoDismissInAppReminder);
}

function* onAutoDismissInAppReminder(): SagaIterator {
  yield put(dismissInAppReminder());
}
