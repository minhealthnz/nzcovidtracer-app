import AsyncStorage from "@react-native-community/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CloseContact } from "react-native-exposure-notification-service";
import { persistReducer } from "redux-persist";

import { ENFNotificationRiskBucketsConfig } from "./api";

export const persistConfig = {
  storage: AsyncStorage,
  key: "enfExposure",
  blacklist: [],
};

export interface ENFAlertData {
  alertTitle: string;
  alertMessage: string;
  linkUrl: string;
  exposureDate: number;
  alertDate: number;
  exposureCount: number;
}

export interface ENFExposureState {
  notificationConfig: ENFNotificationRiskBucketsConfig;
  enfAlert: ENFAlertData | undefined;
  lastEnfAlertDismissDate: number;
}

const initialState: ENFExposureState = {
  notificationConfig: [],
  enfAlert: undefined,
  lastEnfAlertDismissDate: 0,
};

const slice = createSlice({
  name: "enfExposure",
  initialState,
  reducers: {
    setENFNotificationConfig(
      state,
      { payload }: PayloadAction<ENFNotificationRiskBucketsConfig>,
    ) {
      state.notificationConfig = payload;
    },
    processENFContacts(_state, _: PayloadAction<CloseContact[] | undefined>) {},
    setEnfAlert(state, { payload }: PayloadAction<ENFAlertData | undefined>) {
      state.enfAlert = payload;
    },
    dismissEnfAlert(state, { payload }: PayloadAction<number>) {
      state.lastEnfAlertDismissDate = payload;
    },
  },
});

const { reducer } = slice;

export const {
  setENFNotificationConfig,
  processENFContacts,
  setEnfAlert,
  dismissEnfAlert,
} = slice.actions;

export default persistReducer(persistConfig, reducer);
