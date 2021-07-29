import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

const selectState = (state: ReduxState) => state.nfc;

export const selectLastScannedEntry = createSelector(
  selectState,
  (state) => state.lastScannedEntry,
);

export const selectNfcDebounce = createSelector(
  selectState,
  (state) => state.nfcDebounce,
);
