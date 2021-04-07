import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import { ENFNotificationSettings, getENFNotificationConfig } from "../api";
import { retrievedSettings, setTestLocationsLink } from "../commonActions";
import { setCallbackEnabled, setENFNotificationConfig } from "../reducer";

const { logInfo } = createLogger("saga/updateENFNotificationConfig");

export default function* updateENFNotificationConfig(): SagaIterator {
  try {
    const response: ENFNotificationSettings = yield call(
      getENFNotificationConfig,
    );
    yield put(setENFNotificationConfig(response.configurations));
    yield put(setTestLocationsLink(response.testLocationsLink));
    yield put(setCallbackEnabled(response.callbackEnabled || false));
    yield put(retrievedSettings(response));
  } catch (error) {
    logInfo(error);
  }
}
