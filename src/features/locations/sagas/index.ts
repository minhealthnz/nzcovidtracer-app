import { all, call } from "@redux-saga/core/effects";
import { SagaIterator } from "@redux-saga/types";

import { deleteOldLocations } from "./deleteOldLocations";
import { updateHasDiaryEntries } from "./updateHasDiaryEntries";
import { updateHasFavourites } from "./updateHasFavourites";

export default function* watchSaga(): SagaIterator {
  yield all([
    call(deleteOldLocations),
    call(updateHasFavourites),
    call(updateHasDiaryEntries),
  ]);
}
