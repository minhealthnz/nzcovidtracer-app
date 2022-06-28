import { AccessibilityInfo } from "react-native";
import { EventChannel, eventChannel } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { setIsReduceMotionEnabled } from "../reducer";

export function isReducedMotionEnabledChannel() {
  return eventChannel((emit) => {
    const listener = (val: boolean) => {
      emit(val);
    };
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      listener,
    );
    return () => {
      subscription?.remove();
    };
  });
}

export function* loadIsReduceMotionEnabled() {
  const channel: EventChannel<boolean> = yield call(
    isReducedMotionEnabledChannel,
  );

  try {
    const enabled: boolean = yield call(
      AccessibilityInfo.isReduceMotionEnabled,
    );
    yield put(setIsReduceMotionEnabled(enabled));
    while (true) {
      const next: boolean = yield take(channel);
      yield put(setIsReduceMotionEnabled(next));
    }
  } finally {
    channel.close();
  }
}
