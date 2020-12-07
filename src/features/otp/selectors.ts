import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

const selectState = (state: ReduxState) => state.otp;

export const selectOTPSessions = createSelector(
  selectState,
  (state) => state.byId,
);
