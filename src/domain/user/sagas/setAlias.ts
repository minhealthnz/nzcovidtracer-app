import { update } from "@db/entities/user";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  SetAlias,
  setAlias,
  setAliasFulfilled,
  setAliasRejected,
} from "../reducer";

export function* watchSetAlias(updateAlias = _updateAlias): SagaIterator {
  yield takeLatest(setAlias.type, onSetAlias, updateAlias);
}

export function* onSetAlias(
  updateAlias: (userId: string, alias: string) => Promise<void>,
  { payload }: PayloadAction<SetAlias>,
): SagaIterator {
  try {
    yield call(updateAlias, payload.userId, payload.alias);
    yield put(setAliasFulfilled(payload));
  } catch (err) {
    yield put(setAliasRejected(err));
  }
}

async function _updateAlias(userId: string, alias: string) {
  await update(userId, (updated) => (updated.alias = alias));
}
