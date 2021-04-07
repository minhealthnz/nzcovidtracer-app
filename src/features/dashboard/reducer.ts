import { defaultTestLocationsLink } from "@constants";
import { setTestLocationsLink } from "@features/enfExposure/commonActions";
import AsyncStorage from "@react-native-community/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { persistReducer } from "redux-persist";

import { getStats } from "./api";
import { Statistics } from "./types";

const persistConfig = {
  storage: AsyncStorage,
  key: "dashboard",
  whitelist: ["stats", "lastFetched", "expires", "statsError", "statsEmpty"],
};

export interface DashboardState {
  stats?: Statistics;
  lastFetched: number;
  expires: number;
  statsAreLoading: boolean;
  statsError?: string;
  testLocationsLink: string;
  statsEmpty: boolean;
}

const initialState: DashboardState = {
  stats: undefined,
  lastFetched: new Date().getTime(),
  statsAreLoading: false,
  statsError: undefined,
  expires: 0,
  testLocationsLink: defaultTestLocationsLink,
  statsEmpty: false,
};

export const getCovidStatistics = createAsyncThunk(
  "dashboard/getCovidStatistics",
  async (isManualRefresh?: boolean) => {
    const response = await getStats(isManualRefresh);
    return response;
  },
);

const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getCovidStatistics.pending, (state) => {
        state.statsError = undefined;
        state.statsAreLoading = true;
      })
      .addCase(getCovidStatistics.fulfilled, (state, { payload }) => {
        state.statsAreLoading = false;
        state.lastFetched = new Date().getTime();
        const { stats } = payload;

        if (_.isEmpty(stats)) {
          state.statsEmpty = true;
          return;
        }

        if (!Array.isArray(stats.dashboardItems)) {
          state.statsError = "Could not parse statistics.";
          return;
        }

        state.statsEmpty = false;
        state.expires = new Date(payload.expires).getTime();
        state.stats = {
          title: stats.title || "Latest updates",
          sourceUrl: stats.sourceUrl || "https://systems.jhu.edu/",
          sourceDisplay: stats.sourceDisplay || "JHU CSSE COVID-19 Data",
          dashboardItems: stats.dashboardItems
            .filter((group) => Array.isArray(group))
            .map((group) =>
              group.filter(
                (item) => !!item.value && !!item.icon && !!item.subtitle,
              ),
            )
            .filter((group) => group.length > 0),
        };
      })
      .addCase(getCovidStatistics.rejected, (state, { error }) => {
        state.statsAreLoading = false;
        state.statsError = error.message;
        state.lastFetched = new Date().getTime();
      })
      .addCase(setTestLocationsLink, (state, { payload }) => {
        state.testLocationsLink = payload;
      }),
});

const { reducer } = slice;

export { reducer as _reducer };

export default persistReducer(persistConfig, reducer);
