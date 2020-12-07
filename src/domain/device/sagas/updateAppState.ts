import { AppState, AppStateStatus } from "react-native";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { setAppState } from "../reducer";

export function appStateChannel() {
  return eventChannel((emit) => {
    const handleAppStateChange = (state: AppStateStatus) => {
      emit(state);
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  });
}

function getAppState() {
  return AppState.currentState;
}

export function* updateAppState(): SagaIterator {
  const channel: EventChannel<AppStateStatus> = yield call(appStateChannel);

  try {
    const initialState: AppStateStatus = yield call(getAppState);
    yield put(setAppState(initialState));

    while (true) {
      const appState: AppStateStatus = yield take(channel);
      yield put(setAppState(appState));
    }
  } finally {
    yield call([channel, channel.close]);
  }
}
