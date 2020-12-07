import { OTPFulfilled, otpFulfilled, OTPSession } from "@features/otp/reducer";
import { selectOTPSessions } from "@features/otp/selectors";
import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, retry, select, takeLatest } from "redux-saga/effects";

import { uploadDetails as apiUploadDetails } from "../api/uploadDetails";
import { selectUser } from "../selectors";
import { User } from "../types";

const { logInfo, logWarning, logError } = createLogger("saga/uploadDetails");

export function* uploadDetails(): SagaIterator {
  yield takeLatest([otpFulfilled], onUploadDetails);
}

function* onUploadDetails({
  payload,
}: PayloadAction<OTPFulfilled>): SagaIterator {
  const otpSessions: { [id: string]: OTPSession } = yield select(
    selectOTPSessions,
  );
  const user: User = yield select(selectUser);
  const otpSession: OTPSession | undefined = otpSessions[payload.sessionId];

  if (otpSession == null) {
    logInfo("no valid otp session found, skipping..");
    return;
  }

  if (otpSession.type !== "onboardingNew") {
    logInfo(`invalid session type ${otpSession.type}, skipping..`);
    return;
  }

  if (otpSession.accessToken == null) {
    logWarning("access token is empty");
    return;
  }

  if (user.firstName == null && user.lastName == null && user.phone == null) {
    logWarning("nothing to upload");
    return;
  }

  // TODO handle otp access token expired

  const retryTimes = 3;
  const retryInterval = 5000;

  try {
    yield retry(
      retryTimes,
      retryInterval,
      apiUploadDetails,
      otpSession.accessToken,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    );
    yield call(logInfo, "uploaded contact details successfully!");
  } catch (err) {
    yield call(logError, err);
  }
}
