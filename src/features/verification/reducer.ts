import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import {
  registerDeviceFulfilled,
  RegisterDeviceRejected,
  registerDeviceRejected,
  RegisteredDevice,
  setEnfEnabled,
} from "./commonActions";

/**
 * authToken & refreshToken are both empty by default - emulating this
 * https://github.com/covidgreen/react-native-exposure-notification-service/blob/current/src/exposure-provider.tsx#L158
 */
const DEFAULT_TOKEN = "";

export interface VerificationState {
  refreshToken: string;
  token: string;
  enabled: boolean;
  enfEnableNotificationSent: boolean;
  retriable: boolean;
}

export const INITIAL_STATE: VerificationState = {
  refreshToken: DEFAULT_TOKEN,
  token: DEFAULT_TOKEN,
  enabled: false,
  enfEnableNotificationSent: false,
  retriable: true,
};

export const persistConfig = {
  storage: AsyncStorage,
  key: "verification",
  whitelist: [
    "token",
    "refreshToken",
    "retriable",
    "enfEnableNotificationSent",
    "enabled",
  ],
};

export const verification = createSlice({
  name: "verification",
  initialState: INITIAL_STATE,
  reducers: {
    setToken(state, { payload }: PayloadAction<string>) {
      state.token = payload;
    },
    setEnfEnableNotificationSent(state) {
      state.enfEnableNotificationSent = true;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        registerDeviceFulfilled,
        (state, { payload }: PayloadAction<RegisteredDevice>) => {
          state.refreshToken = payload.refreshToken;
          state.token = payload.token;
        },
      )
      .addCase(
        registerDeviceRejected,
        (state, { payload }: PayloadAction<RegisterDeviceRejected>) => {
          if (state.retriable && !payload.isNetworkError) {
            state.retriable = false;
          }
        },
      )
      .addCase(setEnfEnabled, (state, { payload }: PayloadAction<boolean>) => {
        state.enabled = payload;
      }),
});

const { reducer, actions } = verification;

export const { setToken, setEnfEnableNotificationSent } = actions;

export default persistReducer(persistConfig, reducer);
