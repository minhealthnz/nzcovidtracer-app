import {
  OnboardingFlowScreen,
  OnboardingSkippableScreen,
  SessionType,
} from "../types";

export type DeviceRegistered =
  | "success"
  | "failure"
  | "skipped"
  | "retrySuccess";

export interface OnboardingStateV1 {
  /**
   * 5.0 session type
   */
  sessionType: SessionType;
  screens: OnboardingFlowScreen[];
  screenSteps: (number | undefined)[];
  screenTotalSteps: number;
  /**
   * Screens that have been completed
   */
  screenCompleted: {
    [screen in OnboardingFlowScreen]?: boolean;
  };
  /**
   * Screens that have been skipped
   */
  screenSkipped: {
    [screen in OnboardingSkippableScreen]?: boolean;
  };
  /**
   * If true, user has attempted to start diary recovery in the current session,
   * Upon relaunch, this flag is cleared, allowing user to skip the step
   */
  startedCopyDiary: boolean;
  startedCopyDiaryCurrentSession: boolean;
  /**
   * If user has seen the lock code screen
   */
  hasSeenLockCode: boolean;
  /**
   * If user has seen the dashboard
   */
  hasSeenDashboard: boolean;
  hasSeenDashboardEnf: boolean;
  /**
   * If user has old diaries to import, undefined when loading
   */
  hasOldDiary?: boolean;
  /**
   * If the enable alerts screen should be shown
   */
  hasEnabledAlerts: boolean;
  /**
   * If the Enf feature is supported
   */
  enfSupported?: boolean;
  /**
   * Device registeration state
   */
  deviceRegistered?: DeviceRegistered;
  /**
   * If true, user has completed onboarding on 5.0
   */
  hasOnboardedPreEnf: boolean;
  /**
   * If true, still loading which screens to show
   */
  isLoading: boolean;
  loadingDidTimeout: boolean;
}
