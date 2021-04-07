import { CheckInItemMatch, getAllMatches } from "@db/checkInItemMatch";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { setMatches } from "@features/diary/commonActions";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { setMatch } from "../reducer";

const { logError } = createLogger("saga/updateMatches");

export function* updateMatches(): SagaIterator {
  yield takeLatest([appDidBecomeAvailable, setMatch], onUpdateMatches);
}

function* onUpdateMatches(): SagaIterator {
  try {
    const items: CheckInItemMatch[] = yield call(getAllMatches);
    yield put(setMatches(items));
  } catch (err) {
    yield call(logError, err);
  }
}
