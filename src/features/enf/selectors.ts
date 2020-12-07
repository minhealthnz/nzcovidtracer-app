import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectENF = (state: ReduxState) => state.enf;

export const selectIsEnfSupported = createSelector(
  selectENF,
  (enf) => enf.isSupported,
);
