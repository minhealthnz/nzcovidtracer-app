import { createLogger } from "@logger/createLogger";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import { setENFSupported } from "../commonActions";

const { logError } = createLogger("enf/checkSupported");

export function* checkSupported(): SagaIterator {
  try {
    const isSupported: boolean = yield call(
      ExposureNotificationModule.isSupported,
    );
    yield put(setENFSupported(isSupported));
  } catch (err) {
    logError(err);
    yield put(setENFSupported(false));
  }
}
