import { setSessionType } from "@features/onboarding/reducer";
import { selectSessionType } from "@features/onboarding/selectors";
import { SagaIterator } from "redux-saga";
import { put, select, take } from "redux-saga/effects";

import { appDidBecomeAvailable, setAppState } from "../reducer";
import { selectAppState } from "../selectors";

export function* fireAppDidBecomeAvailable(): SagaIterator {
  while (true) {
    yield take([setAppState, setSessionType]);

    const appState = yield select(selectAppState);

    const sessionType = yield select(selectSessionType);

    if (appState === "active" && sessionType !== "unknown") {
      yield put(appDidBecomeAvailable());
    }
  }
}
