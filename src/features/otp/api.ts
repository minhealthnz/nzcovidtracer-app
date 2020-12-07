import { createLogger } from "@logger/createLogger";
import Axios, { AxiosResponse } from "axios";
import { Platform } from "react-native";

import config from "../../config";
import { injectMfaErrorIfNeeded } from "./injection";

export interface InitiateOTPPayload {
  clientId: string;
  email: string;
}

export interface InitiateOTPResponse {
  verificationId: string;
  userId: string;
}

export interface ConfirmOTPPayload {
  clientId: string;
  email: string;
  code: string;
  verificationId: string;
}

export interface ConfirmOTPResponse {
  accessToken: string;
  userId: string;
}

const { logInfo } = createLogger("api/otp");

export async function initiateOTP(email: string) {
  const url = `${config.ApiBaseUrl}/user/auth/initiate`;
  const payload: InitiateOTPPayload = {
    clientId:
      Platform.OS === "ios" ? config.ApiClientIdIOS : config.ApiClientIdAndroid,
    email,
  };
  try {
    const response: AxiosResponse<InitiateOTPResponse> = await Axios.post(
      url,
      payload,
    );
    return response;
  } catch (err) {
    const errorType = err.response?.data?.type;
    if (errorType) {
      logInfo(`initiateOTP failed with ${errorType}`);
    } else {
      logInfo("initiateOTP failed", err);
    }
    throw err;
  }
}

export async function confirmOTP(email: string, session: string, code: string) {
  const url = `${config.ApiBaseUrl}/user/auth/confirm`;
  const payload: ConfirmOTPPayload = {
    email,
    verificationId: session,
    code,
    clientId:
      Platform.OS === "ios" ? config.ApiClientIdIOS : config.ApiClientIdAndroid,
  };
  try {
    if (config.IsDev) {
      injectMfaErrorIfNeeded();
    }
    const response: AxiosResponse<ConfirmOTPResponse> = await Axios.post(
      url,
      payload,
    );
    return response;
  } catch (err) {
    const errorType = err.response?.data?.type;
    if (errorType) {
      logInfo(`confirmOTP failed with ${errorType}`);
    } else {
      logInfo("confirmOTP failed", err);
    }
    throw err;
  }
}
