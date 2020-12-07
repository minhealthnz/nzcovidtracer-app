import { setCountedOldDiaries } from "@features/diary/commonActions";
import {
  registerDeviceFulfilled,
  registerDeviceRejected,
  registerDeviceSkipped,
} from "@features/verification/commonActions";
import { nanoid } from "@reduxjs/toolkit";

import { DeviceRegistered } from "./persist/OnboardingStateV1";
import {
  _reducer as reducer,
  _reduceScreens as reduceScreens,
  loadingDidTimeout,
  OnboardingState,
  setEnfSupported,
} from "./reducer";
import { OnboardingScreen } from "./screens";

const buildState = (partial?: Partial<OnboardingState>): OnboardingState => {
  return {
    sessionType: "unknown",
    hasEnabledAlerts: true,
    screens: [],
    screenSteps: [],
    screenTotalSteps: 3,
    screenCompleted: {},
    screenSkipped: {},
    startedCopyDiary: false,
    startedCopyDiaryCurrentSession: false,
    hasSeenDashboard: false,
    hasSeenDashboardEnf: false,
    hasOldDiary: true,
    hasSeenLockCode: false,
    hasOnboardedPreEnf: false,
    enfSupported: false,
    isLoading: false,
    loadingDidTimeout: false,
    ...partial,
  };
};

type UserType =
  // A new user
  | "new"
  // An existing user, from 5.0
  | "hasOnboardedPreEnf"
  // An existing user, from native, with one user
  | "single"
  // An existing user, from native, with multiple users
  | "multi";

const screens5051 = [OnboardingScreen.ExistingUser, OnboardingScreen.EnableENF];
const screensNew = [
  OnboardingScreen.ValueStatements,
  OnboardingScreen.PrivacyStatement,
  OnboardingScreen.EnableENF,
  OnboardingScreen.EnableAlerts,
  OnboardingScreen.ContactDetails,
  OnboardingScreen.Thanks,
];
const screensSingle = [
  OnboardingScreen.ExistingUser,
  OnboardingScreen.EnableENF,
];
const screensMulti = [
  OnboardingScreen.ExistingUser,
  OnboardingScreen.EnableENF,
  OnboardingScreen.MultipleDiaries,
];

const notEnableEnf = (screen: OnboardingScreen) =>
  screen !== OnboardingScreen.EnableENF;

const cases: [UserType, boolean, OnboardingScreen[]][] = [
  ["hasOnboardedPreEnf", true, screens5051],
  ["hasOnboardedPreEnf", false, screens5051.filter(notEnableEnf)],
  ["new", true, screensNew],
  ["new", false, screensNew.filter(notEnableEnf)],
  ["single", true, screensSingle],
  ["single", false, screensSingle.filter(notEnableEnf)],
  ["multi", true, screensMulti],
  ["multi", false, screensMulti.filter(notEnableEnf)],
];

describe("#reduceScreens", () => {
  it.each(cases)(
    "%s %d",
    (
      userType: UserType,
      enfSupported: boolean,
      screens: OnboardingScreen[],
    ) => {
      const state = buildState({
        hasOnboardedPreEnf: userType === "hasOnboardedPreEnf",
        enfSupported,
        deviceRegistered: enfSupported ? "success" : undefined,
        sessionType: userType === "hasOnboardedPreEnf" ? "new" : userType,
      });
      reduceScreens(state);
      expect(state.screens).toEqual(screens);
    },
  );
});

describe("#setEnfSupported", () => {
  it.each([false, true])("sets flag", (flag) => {
    const state = buildState();
    const next = reducer(state, setEnfSupported(flag));
    expect(next.enfSupported).toBe(flag);
  });
});

describe("#loadingDidTimeout", () => {
  it("sets flag", () => {
    const state = buildState();
    const next = reducer(state, loadingDidTimeout());
    expect(next.loadingDidTimeout).toBe(true);
  });
});

describe("#setCountedOldDiaries", () => {
  it.each([false, true])("sets flag", (hasOldDiary) => {
    const state = buildState();
    const next = reducer(state, setCountedOldDiaries(hasOldDiary));
    expect(next.hasOldDiary).toBe(hasOldDiary);
  });
});

describe("#registerDevice", () => {
  const cases = [
    ["failure", registerDeviceFulfilled.type, "retrySuccess"],
    [undefined, registerDeviceFulfilled.type, "success"],
    [undefined, registerDeviceSkipped.type, "skipped"],
    [undefined, registerDeviceRejected.type, "failure"],
  ];

  it.each(cases)("%s %s %s", (registered, transition, nextRegistered) => {
    let action;
    switch (transition) {
      case registerDeviceFulfilled.type:
        action = registerDeviceFulfilled({
          token: nanoid(),
          refreshToken: nanoid(),
        });
        break;
      case registerDeviceSkipped.type:
        action = registerDeviceSkipped();
        break;
      case registerDeviceRejected.type:
        action = registerDeviceRejected({ isNetworkError: false });
        break;
      default:
        throw new Error(`unexpected action type ${transition}`);
    }

    const state = buildState({
      deviceRegistered: registered as DeviceRegistered,
    });
    const next = reducer(state, action);
    expect(next.deviceRegistered).toBe(nextRegistered);
  });
});
