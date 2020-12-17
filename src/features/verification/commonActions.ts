import { createAction } from "@reduxjs/toolkit";

export interface RegisteredDevice {
  refreshToken: string;
  token: string;
}

export const registerDeviceFulfilled = createAction<RegisteredDevice>(
  "verification/registerDeviceFulfilled",
);

export interface RegisterDeviceRejected {
  isNetworkError?: boolean;
}

export const registerDeviceRejected = createAction<RegisterDeviceRejected>(
  "verfication/registerDeviceRejected",
);

export const setEnfEnabled = createAction<boolean>(
  "verification/setEnfEnabled",
);
