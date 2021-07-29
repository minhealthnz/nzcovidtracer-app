import { update } from "@db/entities/user";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { setNHI, setNHIFulfilled, setNHIRejected } from "../reducer";
import { selectUserId } from "../selectors";

export function* watchSetNHI(updateNHI = _updateNHI): SagaIterator {
  yield takeLatest(setNHI, onSetNHI, updateNHI);
}

export function* onSetNHI(
  updateNHI: (userId: string, nhi: string) => Promise<void>,
  { payload }: PayloadAction<string>,
): SagaIterator {
  const userId = yield select(selectUserId);
  try {
    yield call(updateNHI, userId, payload);
    yield put(setNHIFulfilled(payload));
  } catch (err) {
    yield put(setNHIRejected(err));
  }
}

async function _updateNHI(userId: string, nhi: string) {
  await update(userId, (updated) => (updated.nhi = nhi));
}
