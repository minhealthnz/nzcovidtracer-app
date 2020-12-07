import {
  setAlias,
  setAliasFulfilled,
  setAliasRejected,
} from "@domain/user/reducer";
import { selectUserId } from "@domain/user/selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { put, select, take, takeLatest } from "redux-saga/effects";

import {
  CopyDiary,
  copyDiary as copyDiaryAction,
  copyDiaryFulfilled,
  copyDiaryRejected,
} from "../reducer";

export function* copyDiary(): SagaIterator {
  yield takeLatest(copyDiaryAction, onCopyDiary);
}

function* onCopyDiary({ payload }: PayloadAction<CopyDiary>): SagaIterator {
  const userId: string = yield select(selectUserId);
  const legacyUserId = payload.userId;
  yield put(setAlias({ userId: legacyUserId, alias: userId }));

  const action: PayloadAction = yield take([
    setAliasFulfilled,
    setAliasRejected,
  ]);

  if (action.type === setAliasRejected.type) {
    // TODO translate
    yield put(
      copyDiaryRejected(
        new Error("An unknown error occured. Please try again."),
      ),
    );
  } else {
    yield put(copyDiaryFulfilled());
  }
}
