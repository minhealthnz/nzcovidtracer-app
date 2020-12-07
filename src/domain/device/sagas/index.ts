import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { checkCameraPermission } from "./checkCameraPermission";
import { checkNotificationPermission } from "./checkNotificationPermission";
import { fireAppDidBecomeAvailable } from "./fireAppDidBecomeAvailable";
import { loadIsScreenReaderEnabled } from "./loadIsScreenReaderEnabled";
import { requestCameraPermission } from "./requestCameraPermission";
import { requestNotificationPermission } from "./requestNotificationPermission";
import { resetBadgeNumber } from "./resetBadgeNumber";
import { subscribeToAll } from "./subscribeToAll";
import { updateAppState } from "./updateAppState";

export default function* sagaWatcher(): SagaIterator {
  yield all([
    call(resetBadgeNumber),
    call(checkNotificationPermission),
    call(checkCameraPermission),
    call(subscribeToAll),
    call(requestNotificationPermission),
    call(updateAppState),
    call(fireAppDidBecomeAvailable),
    call(requestCameraPermission),
    call(loadIsScreenReaderEnabled),
  ]);
}
