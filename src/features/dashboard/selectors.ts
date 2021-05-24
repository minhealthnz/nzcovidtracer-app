import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

const selectState = (state: ReduxState) => state.dashboard;

export const selectStats = createSelector(selectState, (state) => state.stats);

export const selectStatsEmpty = createSelector(
  selectState,
  (state) => state.statsEmpty,
);

export const selectLastFetched = createSelector(
  selectState,
  (state) => state.lastFetched,
);

export const selectExpires = createSelector(
  selectState,
  (state) => state.expires,
);

export const selectStatsAreLoading = createSelector(
  selectState,
  (state) => state.statsAreLoading,
);

export const selectStatsError = createSelector(
  selectState,
  (state) => state.statsError,
);

export const selectTestLocationsLink = createSelector(
  selectState,
  (state) => state.testLocationsLink,
);

export const selectHasSeenSwipeInfo = createSelector(
  selectState,
  (state) => state.hasSeenSwipeInfo,
);
