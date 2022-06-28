import { AuthenticatedENFClient } from "@features/verification/api";
import {
  AndroidAttestationService,
  IOSDeviceCheckService,
} from "@features/verification/attestation";
import { isAndroid } from "@lib/helpers";
import { AxiosResponse } from "axios";
import SHA512 from "crypto-js";

import config from "../../config";

export const verify = async (nonce: string) => {
  if (isAndroid) {
    const deviceVerificationPayload =
      await AndroidAttestationService.sendRequest(nonce, config.SafetynetKey);

    return {
      platform: "android",
      deviceVerificationPayload,
    };
  } else {
    const deviceVerificationPayload = await IOSDeviceCheckService.getToken();

    return {
      platform: "ios",
      deviceVerificationPayload,
    };
  }
};

/**
 *  Allows users to validate the verification code they get when given a positive diagnosis.
 *
 *  200: Upload token, if everything is successful, returns token
 *  403: If the code doesn't exist, or it does exist but the last verification attempt on it was within the
 *    configured rate limit period.
 *  410: If the code is too old
 *  429: If any rate limit checks fail
 *  @returns upload token
 */
export const validateCode = async (
  code: string,
): Promise<AxiosResponse<{ token: string }>> => {
  const controlHash = SHA512.SHA512(code.substr(0, 3));
  const codeHash = SHA512.SHA512(code);

  const hash = `${controlHash}${codeHash}`;

  return await AuthenticatedENFClient.post("/exposures/verify", {
    hash,
  });
};

/**
 *  Allows users who've tested positive to submit their Temporary Exposure Keys (TEK) for later distribution.
 *
 *  403: Upload token doesn't exist
 *  410: Upload token is too old
 */
export const uploadExposureKeys = async (
  uploadToken: string,
  exposures: any[],
): Promise<void> => {
  await AuthenticatedENFClient.post("/exposures", {
    token: uploadToken,
    exposures,
    ...(await verify(uploadToken)),
  });
};

interface CallbackRequest {
  phone: string;
  firstName?: string;
  lastName?: string;
  contactNotes?: string;
}

export const requestCallback = async (request: CallbackRequest) => {
  await AuthenticatedENFClient.post("callback", request);
};
