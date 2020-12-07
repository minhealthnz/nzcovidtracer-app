import { AxiosResponse } from "axios";
import { Platform } from "react-native";

import { UnauthenticatedENFClient } from "./client";

/**
 * Get `nonce` for Android
 */
export const postRegister = (): Promise<AxiosResponse<{ nonce: string }>> => {
  return UnauthenticatedENFClient.post("/register", {});
};

/**
 * Retrieve token & refreshToken, nonce must be validated against platform-specific logic
 * @param nonce
 * @param platform
 * @param deviceVerificationPayload
 */
export const putRegister = (
  nonce: string,
  platform: typeof Platform.OS,
  deviceVerificationPayload: string,
): Promise<AxiosResponse<{ token: string; refreshToken: string }>> => {
  return UnauthenticatedENFClient.put("/register", {
    nonce,
    platform,
    deviceVerificationPayload,
  });
};
