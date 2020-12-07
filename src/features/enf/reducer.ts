import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import ExposureNotificationModule from "react-native-exposure-notification-service";

import { AnalyticsEvent, recordAnalyticEvent } from "../../analytics";
import { uploadExposureKeys, validateCode } from "./api";
import { setENFSupported } from "./commonActions";
import { errors } from "./errors";

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

export interface ENFState {
  isSupported?: boolean;
}

const initialState: ENFState = {};

const slice = createSlice({
  name: "enf",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(
      setENFSupported,
      (state, { payload }: PayloadAction<boolean>) => {
        state.isSupported = payload;
      },
    ),
});

const { reducer } = slice;

export default reducer;
