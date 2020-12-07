import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectExposure = (state: ReduxState) => state.exposure;

export const selectMatch = createSelector(
  selectExposure,
  (exposure) => exposure.match,
);

export const selectPollingDisabled = createSelector(
  selectExposure,
  (exposure) => exposure.pollingDisabled,
);
