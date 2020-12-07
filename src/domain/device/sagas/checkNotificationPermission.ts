import { createLogger } from "@logger/createLogger";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { appDidBecomeAvailable, setNotificationPermission } from "../reducer";
import { mapStatus } from "./mapStatus";

const { logError } = createLogger("device/checkNotificationPermission");

export function* checkNotificationPermission(): SagaIterator {
  yield takeLatest(appDidBecomeAvailable.type, onCheckNotificationPermission);
}

export function* onCheckNotificationPermission(): SagaIterator {
  try {
    const fcm = messaging();

    const status: FirebaseMessagingTypes.AuthorizationStatus = yield call([
      fcm,
      fcm.hasPermission,
    ]);

    yield put(setNotificationPermission(mapStatus(status)));
  } catch (error) {
    logError(error);
  }
}
