import { AccessibilityInfo } from "react-native";
import { EventChannel, eventChannel } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { setIsScreenReaderEnabled } from "../reducer";

export function isScreenReaderEnabledChannel() {
  return eventChannel((emit) => {
    const listener = (val: boolean) => {
      emit(val);
    };
    AccessibilityInfo.addEventListener("screenReaderChanged", listener);
    return () => {
      AccessibilityInfo.removeEventListener("screenReaderChanged", listener);
    };
  });
}

export function* loadIsScreenReaderEnabled() {
  const channel: EventChannel<boolean> = yield call(
    isScreenReaderEnabledChannel,
  );

  try {
    const enabled: boolean = yield call(
      AccessibilityInfo.isScreenReaderEnabled,
    );
    yield put(setIsScreenReaderEnabled(enabled));
    while (true) {
      const next: boolean = yield take(channel);
      yield put(setIsScreenReaderEnabled(next));
    }
  } finally {
    channel.close();
  }
}
