import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMigrate } from "redux-persist";

import { migrations } from "./migrations";

export const persistConfig = {
  storage: AsyncStorage,
  key: "onboarding",
  version: 1,
  migrate: createMigrate(migrations, { debug: __DEV__ }),
  whitelist: [
    "hasSeenDashboard",
    "hasSeenLockCode",
    "sessionType",
    "hasOldDiary",
    "hasOnboardedPreEnf",
    "screenCompleted",
    "screenSkipped",
    "startedCopyDiary",
    "deviceRegistered",
    "screens",
    "screenSteps",
    "screenTotalSteps",
    "isLoading",
    "loadingDidTimeout",
    "hasSeenDashboardEnf",
  ],
};
