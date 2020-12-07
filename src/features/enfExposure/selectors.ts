import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectENFExposure = (state: ReduxState) => state.enfExposure;

export const selectENFNotificationConfig = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.notificationConfig,
);

export const selectENFNotificationRiskBucket = (riskScore: number) =>
  createSelector(selectENFNotificationConfig, (config) => {
    const riskBucket = config?.find(
      (bucket) =>
        riskScore >= bucket.minRiskScore && riskScore <= bucket.maxRiskScore,
    );
    return riskBucket ? { ...riskBucket } : undefined;
  });

export const selectENFAlert = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.enfAlert,
);

export const selectLastEnfAlertDismissDate = createSelector(
  selectENFExposure,
  (enfExposure) => enfExposure.lastEnfAlertDismissDate,
);
