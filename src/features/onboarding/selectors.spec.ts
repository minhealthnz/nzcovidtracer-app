import { OnboardingState } from "./reducer";
import { OnboardingScreen } from "./screens";
import { selectHasOnboarded } from "./selectors";
import { onboardingFlowScreens } from "./types";

const buildState = (partial?: Partial<OnboardingState>): OnboardingState => {
  return {
    sessionType: "unknown",
    screenCompleted: onboardingFlowScreens.reduce(
      (map: { [key: string]: boolean }, screen) => {
        map[screen] = true;
        return map;
      },
      {},
    ),
    screenSkipped: {},
    screens: onboardingFlowScreens,
    screenSteps: [],
    screenTotalSteps: 0,
    hasEnabledAlerts: true,
    startedCopyDiary: false,
    startedCopyDiaryCurrentSession: false,
    hasSeenDashboard: false,
    hasSeenDashboardEnf: false,
    hasSeenLockCode: false,
    hasOnboardedPreEnf: false,
    isLoading: false,
    loadingDidTimeout: false,
    ...partial,
  };
};

describe("#hasOnboarded", () => {
  it("true if all screens completed", () => {
    const state = buildState();
    expect(selectHasOnboarded.resultFunc(state)).toBe(true);
  });
  it("false if still loading", () => {
    const state = buildState();
    state.isLoading = true;

    expect(selectHasOnboarded.resultFunc(state)).toBe(false);
  });
  it("false if one screen is not completed, skipped or pending", () => {
    const state = buildState();

    // Not copmleted, by default skipped and pending is false as well
    state.screenCompleted[state.screens[0]] = false;

    expect(selectHasOnboarded.resultFunc(state)).toBe(false);
  });
  it("don't skip multiple diaries if started copying diary", () => {
    const state = buildState();

    state.screenCompleted[OnboardingScreen.MultipleDiaries] = false;

    state.startedCopyDiary = true;
    state.startedCopyDiaryCurrentSession = true;

    expect(selectHasOnboarded.resultFunc(state)).toBe(false);
  });
  it("skip multiple diaries if started copying diary in prev session", () => {
    const state = buildState();

    state.screenCompleted[OnboardingScreen.MultipleDiaries] = false;

    state.startedCopyDiary = true;
    state.startedCopyDiaryCurrentSession = false;

    expect(selectHasOnboarded.resultFunc(state)).toBe(true);
  });
});
