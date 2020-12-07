import { removeMany as dbRemoveCheckInItems } from "@db/checkInItem";
import { removeMany as dbRemoveMatches } from "@db/checkInItemMatch";
import { appDidBecomeAvailable } from "@domain/device/reducer";
import { createLogger } from "@logger/createLogger";
import { calcCheckInMinDate } from "@utils/checkInDate";
import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

const { logError, logInfo } = createLogger("deleteOldData");

export function* deleteOldData(
  removeCheckInItems = dbRemoveCheckInItems,
  removeMatches = dbRemoveMatches,
): SagaIterator {
  yield takeLatest(
    appDidBecomeAvailable,
    onDeleteOldData,
    removeCheckInItems,
    removeMatches,
  );
}

export function* onDeleteOldData(
  removeCheckInItems: (max: Date) => Promise<void>,
  removeMatches: (max: Date) => Promise<void>,
): SagaIterator {
  const minDate = calcCheckInMinDate();

  try {
    yield call(removeCheckInItems, minDate);
    logInfo("Removed check in items");
  } catch (err) {
    logError(err);
  }

  try {
    yield call(removeMatches, minDate);
    logInfo("Removed matches");
  } catch (err) {
    logError(err);
  }
}
