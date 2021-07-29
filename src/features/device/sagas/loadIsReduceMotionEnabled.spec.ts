import { AccessibilityInfo } from "react-native";
import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";

import { setIsReduceMotionEnabled } from "../reducer";
import {
  isReducedMotionEnabledChannel,
  loadIsReduceMotionEnabled,
} from "./loadIsReduceMotionEnabled";

describe("#loadIsReduceMotionEnabled", () => {
  const enabled = true;
  it("set reduceMotionEnabled ", async () => {
    await expectSaga(loadIsReduceMotionEnabled)
      .provide([[call(AccessibilityInfo.isReduceMotionEnabled), enabled]])
      .call(isReducedMotionEnabledChannel)
      .put(setIsReduceMotionEnabled(enabled))
      .silentRun();
  });
});
