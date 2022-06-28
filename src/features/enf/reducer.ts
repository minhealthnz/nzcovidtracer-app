import { isIOS, isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import ExposureNotificationModule, {
  Status,
} from "react-native-exposure-notification-service";
import { persistReducer } from "redux-persist";

import { AnalyticsEvent, recordAnalyticEvent } from "../../analytics";
import { uploadExposureKeys, validateCode } from "./api";
import { setENFSupported } from "./commonActions";
import { errors } from "./errors";

const { logError } = createLogger("enf/reducer");

export interface ShareDiagnosis {
  code: string;
}

const buildError = (message: string, code: string): SerializedError => {
  return {
    message,
    code,
  };
};

const { logInfo } = createLogger("enf/shareDiagnosis");

export const shareDiagnosis = createAsyncThunk(
  "enf/shareDiagnosis",
  async ({ code }: ShareDiagnosis) => {
    try {
      recordAnalyticEvent(AnalyticsEvent.ENFShareUploadCodeEntered);
      const validateResult = await validateCode(code);
      recordAnalyticEvent(AnalyticsEvent.ENFShareUploadCodeSuccess);
      const keys = await ExposureNotificationModule.getDiagnosisKeys();
      await uploadExposureKeys(validateResult.data.token, keys);
      logInfo("upload done");
      recordAnalyticEvent(AnalyticsEvent.ENFShareSuccess);
    } catch (err) {
      logInfo("upload failed", err);
      if (isNetworkError(err)) {
        throw buildError("Network error", errors.shareDiagnosis.networkError);
      }
      const status = err.response?.status;
      switch (status) {
        case 403:
          throw buildError("Code not exists", errors.shareDiagnosis.noExists);
        case 410:
          throw buildError("Code expired", errors.shareDiagnosis.expired);
        case 429:
          throw buildError("Rate limited", errors.shareDiagnosis.rateLimited);
        default:
          throw buildError("Unexpected error", errors.shareDiagnosis.unknown);
      }
    }
  },
);

export const enableBluetooth = createAsyncThunk<number>(
  "enf/enableBluetooth",
  async () => {
    const enableBluetoothOnDevice = () =>
      isIOS
        ? BluetoothStateManager.openSettings()
        : BluetoothStateManager.requestToEnable();
    try {
      await enableBluetoothOnDevice();
    } catch (err) {
      logError(err);
    }
    return Date.now();
  },
);

export interface ENFState {
  isSupported?: boolean;
  lastBluetoothNotificationSent?: number;
  lastBluetoothNotificationPressed?: number;
  enfStatus?: Status;
}

const initialState: ENFState = {};

export const persistConfig = {
  storage: AsyncStorage,
  key: "enf",
  whitelist: [
    "lastBluetoothNotificationSent",
    "lastBluetoothNotificationPressed",
    "enfStatus",
  ],
};

const slice = createSlice({
  name: "enf",
  initialState,
  reducers: {
    bluetoothNotificationSent(state, { payload }: PayloadAction<number>) {
      state.lastBluetoothNotificationSent = payload;
    },
    setEnfStatus(state, { payload }: PayloadAction<Status>) {
      state.enfStatus = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        setENFSupported,
        (state, { payload }: PayloadAction<boolean>) => {
          state.isSupported = payload;
        },
      )
      .addCase(
        enableBluetooth.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          state.lastBluetoothNotificationPressed = payload;
        },
      ),
});

const { reducer, actions } = slice;

export const { bluetoothNotificationSent, setEnfStatus } = actions;

export default persistReducer(persistConfig, reducer);
