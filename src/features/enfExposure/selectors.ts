import { ReduxState } from "@domain/types";
import { selectDevice } from "@features/device/selectors";
import moment from "moment-timezone";
import { createSelector } from "reselect";

import { defaultENFExpiresInDays } from "./util/defaultENFExpiresInDays";

export const selectENFExposure = (state: ReduxState) => state.enfExposure;

export const selectENFNotificationConfig = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.notificationConfig,
);

// TODO selectors should not have parameters. Convert to utility function
export const selectENFNotificationRiskBucket = (riskScore: number) =>
  createSelector(selectENFNotificationConfig, (config) => {
    const riskBucket = config?.find(
      (bucket) =>
        riskScore >= bucket.minRiskScore && riskScore <= bucket.maxRiskScore,
    );
    return riskBucket ? { ...riskBucket } : undefined;
  });

export const selectENFAlert = createSelector(
  [selectENFExposure, selectDevice],
  (enfExposure, device) => {
    // Default alert expiry day is set to 15days
    const alertExpiresInDays =
      defaultENFExpiresInDays(enfExposure.enfAlert?.alertExpiresInDays) + 1;
    const ttl = 60 * 60 * 24 * alertExpiresInDays * 1000;

    if (
      enfExposure.enfAlert != null &&
      moment(device.currentDate).diff(
        moment(enfExposure.enfAlert?.exposureDate),
      ) > ttl
    ) {
      return undefined;
    }
    return enfExposure.enfAlert;
  },
);

export const selectLastEnfAlertDismissDate = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.lastEnfAlertDismissDate,
);

export const selectSetCallbackEnabled = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.callbackEnabled,
);

export const selectENFCallbackRequested = createSelector(
  selectENFExposure,
  (enfExposure) => {
    if (enfExposure.enfAlert == null) {
      return false;
    }
    if (enfExposure.lastCallbackRequestedDate == null) {
      return false;
    }
    return (
      enfExposure.enfAlert.alertDate < enfExposure.lastCallbackRequestedDate
    );
  },
);
