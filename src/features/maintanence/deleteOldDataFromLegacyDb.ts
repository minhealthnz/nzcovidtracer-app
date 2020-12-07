import { appDidBecomeAvailable } from "@domain/device/reducer";
import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import covidTracker from "../../db/covidTracerMigration";

const { logError, logInfo } = createLogger("deleteOldDataFromLegacyDb");

export function* deleteOldDataFromLegacyDb(): SagaIterator {
  yield takeLatest(appDidBecomeAvailable, onDeleteOldDataFromLegacyDb);
}

export function* onDeleteOldDataFromLegacyDb(): SagaIterator {
  if (Platform.OS === "ios" || covidTracker.performMaintenance == null) {
    return;
  }

  try {
    const skipEncryption = __DEV__;
    yield call(covidTracker.performMaintenance, skipEncryption, "-60 days");
    logInfo("Removed check in items from legacy db");
  } catch (err) {
    logError(err);
  }
}
