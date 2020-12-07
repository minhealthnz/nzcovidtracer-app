import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

import { OnboardingState } from "./reducer";
import { OnboardingScreen } from "./screens";
import { OnboardingFlowScreen } from "./types";

export const selectOnboarding = (state: ReduxState) => state.onboarding;

export const selectSessionType = createSelector(
  selectOnboarding,
  (state) => state.sessionType,
);

export const selectScreenCompleted = createSelector(
  selectOnboarding,
  (state) => state.screenCompleted,
);

export const shouldSkip = (
  state: OnboardingState,
  screen: OnboardingFlowScreen,
) => {
  /**
   * Started copying diary, and relaunched
   */
  if (
    screen === OnboardingScreen.MultipleDiaries &&
    state.startedCopyDiary &&
    !state.startedCopyDiaryCurrentSession
  ) {
    return true;
  }
  return false;
};

export const selectHasOnboarded = createSelector(selectOnboarding, (state) => {
  if (state.screens.length === 0) {
    return true;
  }

  if (state.isLoading) {
    return false;
  }

  for (let i = 0; i < state.screens.length; i++) {
    const screen = state.screens[i];
    // Not completed or skipped or pending
    if (!state.screenCompleted[screen] && !shouldSkip(state, screen)) {
      return false;
    }
  }

  return true;
});

export const selectScreens = createSelector(
  selectOnboarding,
  (state) => state.screens,
);

export const selectScreenSteps = createSelector(
  selectOnboarding,
  (state) => state.screenSteps,
);

export const selectScreenTotalSteps = createSelector(
  selectOnboarding,
  (state) => state.screenTotalSteps,
);

export const selectIsLoading = createSelector(
  selectOnboarding,
  (state) => state.isLoading,
);

export const selectHasSeenDashboard = createSelector(
  selectOnboarding,
  (state) => state.hasSeenDashboard,
);

export const selectHasSeenDashboardEnf = createSelector(
  selectOnboarding,
  (state) => state.hasSeenDashboardEnf,
);

export const selectHasSeenLockCode = createSelector(
  selectOnboarding,
  (state) => state.hasSeenLockCode,
);

export const selectHasSeenEnf = createSelector(
  selectOnboarding,
  (state) => state.screenCompleted[OnboardingScreen.EnableENF],
);

export const selectHasOnboardedPreEnf = createSelector(
  selectOnboarding,
  (state) => state.hasOnboardedPreEnf,
);

export const selectDeviceRegistered = createSelector(
  selectOnboarding,
  (state) => state.deviceRegistered,
);

export const selectEnfSupported = createSelector(
  selectOnboarding,
  (state) => state.enfSupported,
);

export const selectInitialScreen = createSelector(selectOnboarding, (state) =>
  state.hasOnboardedPreEnf || state.sessionType !== "new"
    ? OnboardingScreen.ExistingUser
    : OnboardingScreen.ValueStatements,
);
