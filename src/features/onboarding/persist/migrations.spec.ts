import { PersistedState } from "redux-persist";

import { OnboardingScreen } from "../screens";
import { OnboardingFlowScreen, OnboardingSkippableScreen } from "../types";
import { migrations } from "./migrations";
import { OnboardingStateV0 } from "./OnboardingStateV0";
import { OnboardingStateV1 } from "./OnboardingStateV1";

const buildStateV0 = (
  partial: Partial<OnboardingStateV0>,
): OnboardingStateV0 => {
  return {
    hasSeenChanges: false,
    sessionType: "unknown",
    seenValueStatements: false,
    seenPrivacyStatement: false,
    confirmedContactDetails: false,
    enabledNotifications: false,
    hasSeenEnf: false,
    seenThanks: false,
    hasEnabledAlerts: true,
    screens: [],
    screenSteps: [],
    screenPending: [],
    screenTotalSteps: 3,
    skippedEnableAlerts: false,
    skippedContactDetails: false,
    startedCopyDiary: false,
    finishedCopyDiary: false,
    hasSeenDashboard: false,
    hasOldDiary: false,
    hasSeenLockCode: false,
    hasOnboardedPreEnf: false,
    ...partial,
  };
};

const screensToComplete: OnboardingFlowScreen[] = [
  OnboardingScreen.ValueStatements,
  OnboardingScreen.PrivacyStatement,
  OnboardingScreen.EnableAlerts,
  OnboardingScreen.ExistingUser,
  OnboardingScreen.MultipleDiaries,
  OnboardingScreen.EnableENF,
  OnboardingScreen.Thanks,
];

it.each(screensToComplete)(
  "v0 to v1 migrates screen completed (%s)",
  (screen) => {
    const state0: OnboardingStateV0 & PersistedState = {
      _persist: {
        version: 0,
        rehydrated: false,
      },
      ...buildStateV0({
        hasSeenChanges: true,
        seenValueStatements: true,
        seenPrivacyStatement: true,
        seenThanks: true,
        hasSeenEnf: true,
        confirmedContactDetails: true,
        finishedCopyDiary: true,
        enabledNotifications: true,
      }),
    };
    const state1 = migrations["1"](state0) as unknown as OnboardingStateV1;
    expect(state1.screenCompleted[screen]).toBe(true);
  },
);

const screensToSkip: OnboardingSkippableScreen[] = [
  OnboardingScreen.EnableAlerts,
];

it.each(screensToSkip)(
  "v0 to v1 migrates screen skipped as completed",
  (screen) => {
    const state0: OnboardingStateV0 & PersistedState = {
      _persist: {
        version: 0,
        rehydrated: false,
      },
      ...buildStateV0({
        skippedContactDetails: true,
        skippedEnableAlerts: true,
      }),
    };
    const state1 = migrations["1"](state0) as unknown as OnboardingStateV1;
    expect(state1.screenCompleted[screen]).toBe(true);
  },
);

it.each(screensToSkip)("v0 to v1 migrates screen skipped (%s)", (screen) => {
  const state0: OnboardingStateV0 & PersistedState = {
    _persist: {
      version: 0,
      rehydrated: false,
    },
    ...buildStateV0({
      skippedEnableAlerts: true,
      skippedContactDetails: true,
    }),
  };
  const state1 = migrations[1](state0) as unknown as OnboardingStateV1;
  expect(state1.screenSkipped[screen]).toBe(true);
});
