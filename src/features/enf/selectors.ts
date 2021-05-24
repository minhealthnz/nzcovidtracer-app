import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

import { isBluetoothDisabled } from "./helpers";

export const selectENF = (state: ReduxState) => state.enf;

export const selectIsEnfSupported = createSelector(
  selectENF,
  (enf) => enf.isSupported,
);

export const selectBluetoothEnfDisabled = createSelector(
  selectENF,
  (enf) => enf.enfStatus && isBluetoothDisabled(enf.enfStatus),
);
