import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

export const selectDevice = (state: ReduxState) => state.device;

export const selectNotificationPermission = createSelector(
  selectDevice,
  (device) => device.notificationPermission,
);

export const selectCameraPermission = createSelector(
  selectDevice,
  (device) => device.cameraPermission,
);

export const selectCurrentRouteName = createSelector(
  selectDevice,
  (device) => device.currentRouteName,
);

export const selectAppState = createSelector(
  selectDevice,
  (device) => device.appState,
);

export const selectIsScreenReaderEnabled = createSelector(
  selectDevice,
  (device) => device.isScreenReaderEnabled,
);

export const selectHasRequestedCameraPermission = createSelector(
  selectDevice,
  (device) => device.hasRequestedCameraPermission,
);

export const selectSubscriptions = createSelector(
  selectDevice,
  (device) => device.subscriptions,
);
