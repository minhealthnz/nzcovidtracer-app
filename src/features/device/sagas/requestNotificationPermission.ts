import messaging from "@react-native-firebase/messaging";
import { openSettings } from "react-native-permissions";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  requestNotificationPermission as requestNotificationPermissionAction,
  setNotificationPermission,
} from "../reducer";
import { mapStatus } from "./mapStatus";

export function* requestNotificationPermission(): SagaIterator {
  yield takeLatest(
    requestNotificationPermissionAction.type,
    onRequestNotificationPermission,
  );
}

export function* onRequestNotificationPermission(): SagaIterator {
  const fcm = messaging();
  const permission = yield call([fcm, fcm.hasPermission]);

  if (permission === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const status = yield call([fcm, fcm.requestPermission]);
    yield put(setNotificationPermission(mapStatus(status)));
  } else if (permission === messaging.AuthorizationStatus.DENIED) {
    yield call(openSettings);
  }
}
