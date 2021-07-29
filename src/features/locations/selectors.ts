import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

const selectState = (state: ReduxState) => state.locations;

export const selectHasSeenLocationOnboarding = createSelector(
  selectState,
  (state) => state.hasSeenLocationOnboarding,
);

export const selectHasFavourites = createSelector(
  selectState,
  (state) => state.hasFavourites,
);

export const selectHasDiaryEntries = createSelector(
  selectState,
  (state) => state.hasDiaryEntries,
);
