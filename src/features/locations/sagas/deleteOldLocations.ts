import { removeOldLocations } from "@db/entities/location";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "@redux-saga/types";
import { call, takeLatest } from "redux-saga/effects";

export function* deleteOldLocations(): SagaIterator {
  yield takeLatest(appDidBecomeAvailable, onDeleteOldLocations);
}

const { logError } = createLogger("deleteOldLocations");

function* onDeleteOldLocations(): SagaIterator {
  try {
    yield call(removeOldLocations);
  } catch (err) {
    logError(err);
  }
}
