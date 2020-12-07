import { logPerformance } from "@logger/logPerformance";
import { maskToken } from "@utils/mask";
import { Platform } from "react-native";

import config from "../../config";
import { postRegister, putRegister } from "./api";
import {
  AndroidAttestationService,
  IOSDeviceCheckService,
} from "./attestation";

/**
 * Call platform's specific safety check (SafetyNet attestation for Android, DeviceCheck for iOS)
 */
export async function getPayload(
  platform: typeof Platform.OS,
  nonce: string,
  safetyNetKey: string,
  androidAttestationService = AndroidAttestationService,
  iOSDeviceCheckService = IOSDeviceCheckService,
): Promise<string> {
  if (platform === "android") {
    return await androidAttestationService.sendRequest(nonce, safetyNetKey);
  } else {
    return await iOSDeviceCheckService.getToken();
  }
}

let verifyDeviceAttempt = 0;
/**
 * Verify a device
 * @returns tokens
 */
export async function verifyDevice(): Promise<{
  token: string;
  refreshToken: string;
}> {
  verifyDeviceAttempt++;
  const performanceKey = `verifyDevice ${verifyDeviceAttempt}`;
  logPerformance(performanceKey, "start");
  const response = await postRegister();
  const nonce = response.data.nonce;
  logPerformance(performanceKey, `post register, nonce ${maskToken(nonce)}`);
  const platform = Platform.OS;
  const safetyNetKey = config.SafetynetKey;
  const payload = await getPayload(platform, nonce, safetyNetKey);
  logPerformance(performanceKey, `get payload, ${maskToken(payload)}`);
  if (!payload) {
    throw new Error("Unexpected empty device token");
  }
  const { data: tokens } = await putRegister(nonce, platform, payload);
  logPerformance(performanceKey, "put register");
  return tokens;
}
