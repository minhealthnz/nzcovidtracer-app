import { getHasDiaryEntries } from "@db/entities/location";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { addEntry, deleteEntry } from "@features/diary/reducer";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import { SagaIterator } from "@redux-saga/types";

import { setHasDiaryEntries } from "../reducer";

export function* updateHasDiaryEntries(): SagaIterator {
  yield takeLatest(
    [appDidBecomeAvailable, addEntry.fulfilled, deleteEntry.fulfilled],
    onUpdateHasDiaryEntries,
  );
}

export function* onUpdateHasDiaryEntries(): SagaIterator {
  const hasDiaryEntry = yield call(getHasDiaryEntries);
  yield put(setHasDiaryEntries(hasDiaryEntry));
}
