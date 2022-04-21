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

export const selectPassDisabled = createSelector(
  selectDevice,
  (device) => device.passDisabled,
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

export const selectIsReduceMotionEnabled = createSelector(
  selectDevice,
  (device) => device.isReduceMotionEnabled,
);

export const selectHasRequestedCameraPermission = createSelector(
  selectDevice,
  (device) => device.hasRequestedCameraPermission,
);

export const selectSubscriptions = createSelector(
  selectDevice,
  (device) => device.subscriptions,
);

export const selectCurrentDate = createSelector(
  selectDevice,
  (device) => device.currentDate,
);

export const selectInternetReachable = createSelector(
  selectDevice,
  (device) => device.internetReachable,
);

export const selectShouldSubscribeToAnnouncementsByDefault = createSelector(
  selectDevice,
  (device) => device.shouldSubscribeToAnnouncementsByDefault,
);
