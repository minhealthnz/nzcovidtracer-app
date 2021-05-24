import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectResources = (state: ReduxState) => state.resources;

export const selectCurrentDate = (state: ReduxState) =>
  state.device.currentDate;

export const selectError = createSelector(
  selectResources,
  (state) => state.error,
);

export const selectData = createSelector(
  selectResources,
  (state) => state.data || { sections: [] },
);

export const selectIsExpired = createSelector(
  selectResources,
  selectCurrentDate,
  (state, currentDate) => {
    const expiry = state.expires;
    if (expiry == null) {
      return false;
    }
    return currentDate.valueOf() > expiry;
  },
);
