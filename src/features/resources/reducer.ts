import { RemoteSectionListData } from "@components/types";
import { sectionListSchema } from "@components/validations";
import { ReduxState } from "@domain/types";
import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import AsyncStorage from "@react-native-community/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { maskToken } from "@utils/mask";
import { persistReducer } from "redux-persist";
import { ValidationError } from "yup";

import { getData as apiGetData } from "./api/getData";

export interface ResourcesState {
  data?: RemoteSectionListData;
  expires?: number;
  etag?: string;
  error?: "network" | "unknown";
}

const initialState: ResourcesState = {};

const { logInfo, logError } = createLogger("resources/reducer");

export const getData = createAsyncThunk(
  "resources/getData",
  async (_, { getState }) => {
    const { resources } = getState() as ReduxState;
    try {
      logInfo(`fetching resources data with etag ${maskToken(resources.etag)}`);
      const response = await apiGetData(resources.etag);
      if (!response.notModified) {
        await sectionListSchema.validate(response.data);
      }
      if (response.notModified) {
        logInfo("resources data not modified");
      } else {
        logInfo("resources data updated");
      }
      return response;
    } catch (err) {
      if (isNetworkError(err)) {
        // Network error is not logged
        throw {
          code: "network",
        };
      }

      logError(err);

      if (err instanceof ValidationError) {
        throw {
          code: "validation",
        };
      }

      throw {
        code: "unknown",
      };
    }
  },
);

const slice = createSlice({
  name: "resources",
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getData.fulfilled, (state, { payload }) => {
        if (payload.notModified) {
          state.expires = payload.expires?.valueOf();
          state.error = undefined;
          return;
        }
        state.data = payload.data;
        state.expires = payload.expires?.valueOf();
        state.etag = payload.etag;
        logInfo(`store etag ${maskToken(payload.etag)}`);
        state.error = undefined;
      })
      .addCase(getData.rejected, (state, { error }) => {
        if (error.code === "network") {
          state.error = "network";
        } else {
          state.error = "unknown";
        }
      }),
  initialState,
});

const { reducer } = slice;

export { reducer as _reducer };

export const persistConfig = {
  storage: AsyncStorage,
  key: "resources",
  whitelist: ["data", "expires", "etag"],
};

export default persistReducer(persistConfig, reducer);
