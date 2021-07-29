import { getHasFavourites } from "@db/entities/location";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import { SagaIterator } from "@redux-saga/types";

import { addFavourite } from "../actions/addFavourite";
import { removeFavourite } from "../actions/removeFavourite";
import { setHasFavourites } from "../reducer";

export function* updateHasFavourites(): SagaIterator {
  yield takeLatest(
    [appDidBecomeAvailable, addFavourite.fulfilled, removeFavourite.fulfilled],
    onUpdateHasFavourites,
  );
}

export function* onUpdateHasFavourites(): SagaIterator {
  const hasFavourites = yield call(getHasFavourites);
  yield put(setHasFavourites(hasFavourites));
}
