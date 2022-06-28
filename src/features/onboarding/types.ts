import { OnboardingScreen } from "./screens";

/**
 * 5.0 session type.
 * If new, no legacy users were found.
 * If single, one legacy user is found, and user info can be auto imported.
 * If multi, multiple legacy users were found.
 */
export type SessionType = "unknown" | "new" | "single" | "multi";

const onboardingFlowScreenMap = {
  [OnboardingScreen.ValueStatements]: true,
  [OnboardingScreen.PrivacyStatement]: true,
  [OnboardingScreen.EnableENF]: true,
  [OnboardingScreen.EnableAlerts]: true,
  [OnboardingScreen.Thanks]: true,
  [OnboardingScreen.ExistingUser]: true,
  [OnboardingScreen.MultipleDiaries]: true,
};

export type OnboardingFlowScreen = keyof typeof onboardingFlowScreenMap;

export const onboardingFlowScreens = Object.keys(
  onboardingFlowScreenMap,
) as OnboardingFlowScreen[];

export const skippableScreens = {
  [OnboardingScreen.EnableAlerts]: true,
  [OnboardingScreen.EnableENF]: true,
};

export type OnboardingSkippableScreen = keyof typeof skippableScreens;

export const toSkippable = (
  screen: OnboardingFlowScreen,
): OnboardingSkippableScreen | undefined => {
  return screen in skippableScreens
    ? (screen as OnboardingSkippableScreen)
    : undefined;
};
