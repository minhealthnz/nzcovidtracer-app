import { OnboardingFlowScreen, SessionType } from "../types";

export interface OnboardingStateV0 {
  hasSeenChanges: boolean;
  sessionType: SessionType;
  seenValueStatements: boolean;
  seenPrivacyStatement: boolean;
  confirmedContactDetails: boolean;
  enabledNotifications: boolean;
  seenThanks: boolean;
  screens: OnboardingFlowScreen[];
  screenSteps: (number | undefined)[];
  screenTotalSteps: number;
  screenPending: (boolean | undefined)[];
  hasEnabledAlerts: boolean;
  skippedEnableAlerts: boolean;
  skippedContactDetails: boolean;
  startedCopyDiary: boolean;
  finishedCopyDiary: boolean;
  hasSeenLockCode: boolean;
  hasSeenDashboard: boolean;
  hasOldDiary?: boolean;
  hasSeenEnf: boolean;
  enfSupportedAndVerified?: boolean;
  hasOnboardedPreEnf: boolean;
}
