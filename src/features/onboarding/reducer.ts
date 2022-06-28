import { setCountedOldDiaries } from "@features/diary/commonActions";
import {
  registerDeviceFulfilled,
  registerDeviceRejected,
} from "@features/verification/commonActions";
import { createLogger } from "@logger/createLogger";
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { persistReducer } from "redux-persist";

import { persistConfig } from "./persist/config";
import { OnboardingStateV1 } from "./persist/OnboardingStateV1";
import { OnboardingScreen } from "./screens";
import {
  OnboardingFlowScreen,
  OnboardingSkippableScreen,
  SessionType,
} from "./types";

export interface OnboardingState extends OnboardingStateV1 {}

const { logInfo } = createLogger("onboarding/reducer");

const initialState: OnboardingState = {
  sessionType: "unknown",
  screenCompleted: {},
  screenSkipped: {},
  screens: [],
  screenSteps: [],
  screenTotalSteps: 0,
  hasEnabledAlerts: Platform.OS === "ios",
  startedCopyDiary: false,
  startedCopyDiaryCurrentSession: false,
  hasSeenDashboard: false,
  hasSeenDashboardEnf: false,
  hasSeenLockCode: false,
  /**
   * This flag is set in 5.0 (pre enf) after user onboards.
   * The code to set the flag was deleted as it was no longer needed
   */
  hasOnboardedPreEnf: false,
  isLoading: true,
  loadingDidTimeout: false,
};

function getShouldShowEnf(state: OnboardingState) {
  return (
    state.enfSupported &&
    state.deviceRegistered === "success" &&
    !state.screenCompleted[OnboardingScreen.EnableENF]
  );
}

const reduceIsLoading = (state: Draft<OnboardingState>) => {
  if (state.sessionType === "unknown") {
    return;
  }

  if (state.loadingDidTimeout) {
    if (state.isLoading) {
      logInfo(`isLoading ${state.isLoading} => ${false}`);
      state.isLoading = false;
      reduceScreens(state);
    }
    return;
  }

  const loadingEnf =
    state.enfSupported === undefined || state.deviceRegistered === undefined;
  const loadingDiary = state.hasOldDiary === undefined;

  let isLoading = loadingEnf;

  if (state.sessionType === "multi") {
    isLoading = isLoading || loadingDiary;
  }

  if (state.isLoading !== isLoading) {
    logInfo(`isLoading ${state.isLoading} => ${isLoading}`);
    state.isLoading = isLoading;
    reduceScreens(state);
  }
};

function reduceScreens(state: Draft<OnboardingState>) {
  const shouldShowEnf = getShouldShowEnf(state);

  // Existing user from 5.0
  if (state.hasOnboardedPreEnf) {
    state.screens = [OnboardingScreen.ExistingUser];

    if (shouldShowEnf) {
      state.screens.push(OnboardingScreen.EnableENF);
    }
  }
  // New users
  else if (state.sessionType === "new") {
    const screens: OnboardingFlowScreen[] = [OnboardingScreen.ValueStatements];

    const steps: (number | undefined)[] = [];
    let stepCount = 0;

    steps[screens.length] = stepCount++;
    screens.push(OnboardingScreen.PrivacyStatement);

    if (shouldShowEnf) {
      steps[screens.length] = stepCount++;
      screens.push(OnboardingScreen.EnableENF);
    }

    if (
      state.hasEnabledAlerts &&
      !state.screenCompleted[OnboardingScreen.EnableAlerts]
    ) {
      steps[screens.length] = stepCount++;
      screens.push(OnboardingScreen.EnableAlerts);
    }
    screens.push(OnboardingScreen.Thanks);
    state.screens = screens;
    state.screenSteps = steps;
    state.screenTotalSteps = stepCount;
  }
  // Existing user from native version, single user
  else if (state.sessionType === "single") {
    const screens: OnboardingFlowScreen[] = [OnboardingScreen.ExistingUser];

    if (shouldShowEnf) {
      screens.push(OnboardingScreen.EnableENF);
    }
    state.screens = screens;
  }
  // Existing user from native version, multi user
  else if (state.sessionType === "multi") {
    state.screens = [OnboardingScreen.ExistingUser];

    if (shouldShowEnf) {
      state.screens.push(OnboardingScreen.EnableENF);
    }

    if (
      state.hasOldDiary &&
      !state.screenCompleted[OnboardingScreen.MultipleDiaries]
    ) {
      state.screens.push(OnboardingScreen.MultipleDiaries);
    }
  }
}

export { reduceScreens as _reduceScreens };

const slice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setSessionType(state, { payload }: PayloadAction<SessionType>) {
      if (state.sessionType === "unknown") {
        state.sessionType = payload;
        reduceScreens(state);
      }
    },
    setEnfSupported(state, { payload }: PayloadAction<boolean>) {
      state.enfSupported = payload;
      reduceIsLoading(state);
    },
    navigateNext(state, { payload }: PayloadAction<OnboardingFlowScreen>) {
      state.screenCompleted[payload] = true;
      const message = state.screens
        .map((screen) => {
          const line = `${screen} ${
            state.screenCompleted[screen] ? "Done" : "-"
          }`;
          return screen === payload ? `-- ${line}` : line;
        })
        .join("\n");
      logInfo(`screens:\n${message}`);
    },
    setHasSeenEnf(state) {
      state.screenCompleted[OnboardingScreen.EnableENF] = true;
    },
    setHasSeenDashboard(state) {
      state.hasSeenDashboard = true;
      state.hasSeenDashboardEnf = true;
    },
    setStartedCopyDiary(state) {
      state.startedCopyDiary = true;
      state.startedCopyDiaryCurrentSession = true;
    },
    setFinishedCopyDiary(state) {
      state.screenCompleted[OnboardingScreen.MultipleDiaries] = true;
    },
    setHasSeenLockCode(state) {
      state.hasSeenLockCode = true;
    },
    skip(state, { payload }: PayloadAction<OnboardingSkippableScreen>) {
      state.screenSkipped[payload] = true;
    },
    unskip(state, { payload }: PayloadAction<OnboardingSkippableScreen>) {
      state.screenSkipped[payload] = false;
    },
    loadingDidTimeout(state) {
      state.loadingDidTimeout = true;
      reduceIsLoading(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setCountedOldDiaries,
      (state, { payload }: PayloadAction<boolean>) => {
        state.hasOldDiary = payload;
        reduceIsLoading(state);
      },
    );
    builder
      .addCase(registerDeviceFulfilled, (state, _action) => {
        switch (state.deviceRegistered) {
          case "failure":
            state.deviceRegistered = "retrySuccess";
            break;
          default:
            state.deviceRegistered = "success";
            break;
        }
        reduceIsLoading(state);
      })
      .addCase(registerDeviceRejected, (state, _action) => {
        if (state.deviceRegistered === undefined) {
          state.deviceRegistered = "failure";
        }
        reduceIsLoading(state);
      });
  },
});

const { reducer, actions } = slice;

export const {
  setSessionType,
  setHasSeenDashboard,
  setStartedCopyDiary,
  setFinishedCopyDiary,
  setHasSeenLockCode,
  setEnfSupported,
  skip,
  unskip,
  navigateNext,
  setHasSeenEnf,
  loadingDidTimeout,
} = actions;

export { reducer as _reducer };

export default persistReducer(persistConfig, reducer);
