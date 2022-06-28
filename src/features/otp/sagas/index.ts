import { navigateNext } from "@features/onboarding/reducer";
import { OnboardingScreen } from "@features/onboarding/screens";
import { createLogger } from "@logger/createLogger";
import { navigationRef } from "@navigation/navigation";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { all, call, put, select, take } from "redux-saga/effects";

import { OTPFulfilled, otpFulfilled, OTPSession } from "../reducer";
import { selectOTPSessions } from "../selectors";

const { logWarning } = createLogger("otp/saga");

export function* onOtpFulfilled(): SagaIterator {
  while (true) {
    const action: PayloadAction<OTPFulfilled> = yield take(otpFulfilled.type);
    const sessionId = action.payload.sessionId;
    const sessionMap: { [id: string]: OTPSession } = yield select(
      selectOTPSessions,
    );
    const session = sessionMap[sessionId];
    if (session == null) {
      logWarning(`session not found ${sessionId}`);
      continue;
    }

    switch (session.type) {
      // TODO move this logic to onboarding saga
      case "onboardingNew":
        if (navigationRef.current == null) {
          logWarning("cannot find navigation ref");
          break;
        }
        yield put(navigateNext(OnboardingScreen.Thanks));
        break;
      default:
        break;
    }
  }
}

export default function* sagaWatcher(): SagaIterator {
  yield all([call(onOtpFulfilled)]);
}
