import { appDidBecomeAvailable } from "@features/device/reducer";
import {
  selectDeviceRegistered,
  selectHasSeenEnf,
} from "@features/onboarding/selectors";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import {
  registerDeviceFulfilled,
  registerDeviceRejected,
} from "../commonActions";
import { selectRefreshToken, selectToken } from "../selectors";
import { registerDevice } from "./registerDevice";

jest.mock("react-native-exposure-notification-service", () => ({
  isSupported: async () => {
    return true;
  },
}));

describe("#registerDevice", () => {
  it("fullfills registration", async () => {
    const tokens = {
      token: nanoid(),
      refreshToken: nanoid(),
    };
    const verifyDevice = jest.fn().mockReturnValue(tokens);
    await expectSaga(registerDevice, verifyDevice)
      .provide([
        [select(selectRefreshToken), undefined],
        [select(selectDeviceRegistered), "skipped"],
        [select(selectHasSeenEnf), false],
      ])
      .dispatch(appDidBecomeAvailable())
      .put(registerDeviceFulfilled(tokens))
      .silentRun();
  });
  it("rejects registration", async () => {
    const verifyDevice = jest.fn().mockRejectedValue(new Error("foo"));
    await expectSaga(registerDevice, verifyDevice)
      .provide([
        [select(selectRefreshToken), undefined],
        [select(selectDeviceRegistered), "skipped"],
        [select(selectHasSeenEnf), false],
      ])
      .dispatch(appDidBecomeAvailable())
      .put(registerDeviceRejected({ isNetworkError: false }))
      .silentRun();
  });
  it("fulfills registration if already registered", async () => {
    const verifyDevice = jest.fn();
    const refreshToken = nanoid();
    const token = nanoid();
    await expectSaga(registerDevice, verifyDevice)
      .provide([
        [select(selectRefreshToken), refreshToken],
        [select(selectToken), token],
        [select(selectDeviceRegistered), "skipped"],
        [select(selectHasSeenEnf), false],
      ])
      .dispatch(appDidBecomeAvailable())
      .not.call(verifyDevice)
      .put(registerDeviceFulfilled({ refreshToken, token }))
      .silentRun();
  });
});
