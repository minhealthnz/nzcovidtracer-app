import { ReduxState } from "@domain/types";
import { createSelector } from "@reduxjs/toolkit";

const selectState = (state: ReduxState) => state.migration;

export const selectUsersCopied = createSelector(
  selectState,
  (state) => state.usersCopied,
);

export const selectCheckInsCopied = createSelector(
  selectState,
  (state) => state.checkInsCopied,
);

export const selectMatchesCopied = createSelector(
  selectState,
  (state) => state.matchesCopied,
);
