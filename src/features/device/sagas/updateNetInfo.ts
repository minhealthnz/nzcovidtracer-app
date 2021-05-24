import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { put, takeEvery } from "@redux-saga/core/effects";
import { eventChannel, SagaIterator } from "redux-saga";

import { setInternetReachable } from "../reducer";

export function netInfoChannel() {
  return eventChannel((emit) => {
    const handleNetInfoChange = (state: NetInfoState) => {
      emit(state);
    };

    return NetInfo.addEventListener(handleNetInfoChange);
  });
}

export function* updateNetInfo(): SagaIterator {
  const channel = netInfoChannel();
  yield takeEvery(channel, onUpdateNetInfo);
}

function* onUpdateNetInfo(state: NetInfoState): SagaIterator {
  const isInternetReachable =
    state.isInternetReachable === undefined ? null : state.isInternetReachable;
  yield put(setInternetReachable(isInternetReachable));
}
