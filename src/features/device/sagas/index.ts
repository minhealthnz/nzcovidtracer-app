import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { checkCameraPermission } from "./checkCameraPermission";
import { checkNotificationPermission } from "./checkNotificationPermission";
import { fireAppDidBecomeAvailable } from "./fireAppDidBecomeAvailable";
import { handleNotificationOpened } from "./handleNotificationOpened";
import { loadIsScreenReaderEnabled } from "./loadIsScreenReaderEnabled";
import { requestCameraPermission } from "./requestCameraPermission";
import { requestNotificationPermission } from "./requestNotificationPermission";
import { resetBadgeNumber } from "./resetBadgeNumber";
import { subscribeToTopics } from "./subscribeToTopics";
import { updateAppState } from "./updateAppState";
import { updateCurrentDate } from "./updateCurrentDate";
import { updateEndpoint } from "./updateEndpoint";

export default function* sagaWatcher(): SagaIterator {
  yield all([
    call(resetBadgeNumber),
    call(checkNotificationPermission),
    call(checkCameraPermission),
    call(subscribeToTopics),
    call(requestNotificationPermission),
    call(updateAppState),
    call(fireAppDidBecomeAvailable),
    call(requestCameraPermission),
    call(loadIsScreenReaderEnabled),
    call(handleNotificationOpened),
    call(updateEndpoint),
    call(updateCurrentDate),
  ]);
}
