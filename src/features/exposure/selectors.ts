import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectExposure = (state: ReduxState) => state.exposure;

export const selectMatch = createSelector(
  selectExposure,
  (exposure) => exposure.match,
);

export const selectStartDate = createSelector(
  selectExposure,
  (exposure) => exposure.match?.checkInStartDate,
);

export const selectEndDate = createSelector(
  selectExposure,
  (exposure) => exposure.match?.endDate,
);

export const selectGlobalLocationHash = createSelector(
  selectExposure,
  (exposure) => exposure.match?.globalLocationNumberHash,
);

export const selectRiskyLocationName = createSelector(
  selectExposure,
  (exposure) => exposure.checkInItem?.location.name,
);

export const selectCheckInId = createSelector(
  selectExposure,
  (exposure) => exposure.checkInItem?.id,
);

export const selectPollingDisabled = createSelector(
  selectExposure,
  (exposure) => exposure.pollingDisabled,
);

export const selectMatches = createSelector(
  selectExposure,
  (exposure) => exposure.matches,
);
