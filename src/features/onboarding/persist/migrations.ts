import { createLogger } from "@logger/createLogger";
import { MigrationManifest, PersistedState } from "redux-persist";

import config from "../../../config";
import { OnboardingScreen } from "../screens";
import { OnboardingStateV0 } from "./OnboardingStateV0";
import { OnboardingStateV1 } from "./OnboardingStateV1";

const { logInfo } = createLogger("onboarding/migrations");

export const migrations: MigrationManifest = {
  1: (state: PersistedState): PersistedState & OnboardingStateV1 => {
    const prev = (state as unknown) as PersistedState & OnboardingStateV0;

    if (config.IsDev) {
      logInfo(JSON.stringify(prev, null, 2));
    }

    // Moved individual completed and skipped flags to maps
    const next = {
      ...prev,
      screenCompleted: {
        [OnboardingScreen.ValueStatements]: prev.seenValueStatements,
        [OnboardingScreen.PrivacyStatement]: prev.seenPrivacyStatement,
        [OnboardingScreen.EnableAlerts]:
          prev.enabledNotifications || prev.skippedEnableAlerts,
        [OnboardingScreen.ContactDetails]:
          prev.confirmedContactDetails || prev.skippedContactDetails,
        [OnboardingScreen.ExistingUser]: prev.hasSeenChanges,
        [OnboardingScreen.MultipleDiaries]: prev.finishedCopyDiary,
        [OnboardingScreen.EnableENF]: prev.hasSeenEnf,
        [OnboardingScreen.Thanks]: prev.seenThanks,
      },
      screenSkipped: {
        [OnboardingScreen.EnableAlerts]: prev.skippedEnableAlerts,
        [OnboardingScreen.ContactDetails]: prev.skippedContactDetails,
      },
      startedCopyDiaryCurrentSession: false,
      isLoading: false,
      loadingDidTimeout: false,
      hasSeenDashboardEnf: false,
    };

    if (config.IsDev) {
      logInfo(JSON.stringify(next, null, 2));
    }

    return next;
  },
};
