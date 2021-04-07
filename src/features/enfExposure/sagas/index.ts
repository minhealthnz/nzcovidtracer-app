import { appDidBecomeAvailable } from "@features/device/reducer";
import { SagaIterator } from "redux-saga";
import { all, call, takeLatest } from "redux-saga/effects";

import { processENFContacts } from "../reducer";
import { logExposureEvent } from "./logExposureEvent";
import updateENFAlert from "./updateENFAlert";
import updateENFNotificationConfig from "./updateENFNotificationConfig";

export default function* sagaWatcher(): SagaIterator {
  yield all([
    yield takeLatest(appDidBecomeAvailable, updateENFNotificationConfig),
    yield takeLatest(processENFContacts, updateENFAlert),
    yield call(logExposureEvent),
  ]);
}
