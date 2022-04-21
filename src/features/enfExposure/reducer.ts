import { requestCallback } from "@features/enf/api";
import { isNetworkError } from "@lib/helpers";
import AsyncStorage from "@react-native-community/async-storage";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
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
  alertExpiresInDays: number;
  linkUrl: string;
  exposureDate: number;
  alertDate: number;
  exposureCount: number;
}

export interface ENFExposureState {
  notificationConfig: ENFNotificationRiskBucketsConfig;
  enfAlert: ENFAlertData | undefined;
  lastEnfAlertDismissDate: number;
  callbackEnabled: boolean;
  lastCallbackRequestedDate?: number;
}

export interface RequestCallback {
  firstName: string;
  lastName: string;
  phone: string;
  notes?: string;
}

export const errors = {
  requestCallbackEnf: {
    network: "errors:requestCallbackEnf:network",
    disabled: "urn:errors:disabled",
  },
};

const buildError = (message: string, code: string): SerializedError => {
  return {
    message,
    code,
  };
};

export const requestCallbackEnf = createAsyncThunk(
  "enfExposure/requestCallbackEnf",
  async (request: RequestCallback) => {
    try {
      await requestCallback({
        ...request,
        contactNotes: request.notes,
        phone: request.phone.replace(/\s/g, ""),
      });
    } catch (err) {
      if (isNetworkError(err)) {
        throw buildError("Network error", errors.requestCallbackEnf.network);
      }
      if (err.response?.data?.type === "urn:errors:disabled") {
        throw buildError("Disabled", errors.requestCallbackEnf.disabled);
      }
      throw err;
    }
  },
);

const initialState: ENFExposureState = {
  notificationConfig: [],
  enfAlert: undefined,
  lastEnfAlertDismissDate: 0,
  callbackEnabled: false,
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
    setCallbackEnabled(state, { payload }: PayloadAction<boolean>) {
      state.callbackEnabled = payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(requestCallbackEnf.fulfilled, (state) => {
      state.lastCallbackRequestedDate = new Date().getTime();
    }),
});

const { reducer } = slice;

export const {
  setENFNotificationConfig,
  processENFContacts,
  setEnfAlert,
  dismissEnfAlert,
  setCallbackEnabled,
} = slice.actions;

export default persistReducer(persistConfig, reducer);
