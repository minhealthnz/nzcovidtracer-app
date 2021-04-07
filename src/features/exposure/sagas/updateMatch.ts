import {
  CheckInItemMatch,
  getMostRecentUnacknowledgedMatch,
} from "@db/checkInItemMatch";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { setMatchesCopied } from "@features/migration/reducer";
import { createLogger } from "@logger/createLogger";
import { put } from "redux-saga-test-plan/matchers";
import { call, takeLatest } from "redux-saga/effects";

import { setMatch } from "../reducer";

const { logError } = createLogger("saga/updateMatch");

export function* updateMatch() {
  yield takeLatest([appDidBecomeAvailable, setMatchesCopied], onUpdateMatch);
}

function* onUpdateMatch() {
  try {
    const match: CheckInItemMatch | undefined = yield call(
      getMostRecentUnacknowledgedMatch,
    );
    if (match != null) {
      yield put(setMatch(match));
    }
  } catch (err) {
    yield call(logError, err);
  }
}
