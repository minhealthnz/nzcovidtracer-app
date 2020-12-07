import { createLogger } from "@logger/createLogger";
import messaging from "@react-native-firebase/messaging";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  appDidBecomeAvailable,
  PermissionStatus,
  setNotificationPermission,
  subscriptionFulfilled,
  subscriptionRejected,
} from "../reducer";
import {
  selectNotificationPermission,
  selectSubscriptions,
} from "../selectors";

const { logInfo, logError } = createLogger("device/subscribeToAll");

export function* subscribeToAll(): SagaIterator {
  yield takeLatest(
    [setNotificationPermission, appDidBecomeAvailable],
    onSubcribeToAll,
  );
}

export function* onSubcribeToAll(): SagaIterator {
  const status: PermissionStatus = yield select(selectNotificationPermission);

  const subscriptions: ReturnType<typeof selectSubscriptions.resultFunc> = yield select(
    selectSubscriptions,
  );

  if (subscriptions.all?.fullfilled) {
    logInfo("already subscribed, skip");
    return;
  }

  if (status === "granted") {
    const fcm = messaging();
    const topicName = "all";
    try {
      yield call([fcm, fcm.subscribeToTopic], topicName);
      yield call(logInfo, "Subscribed to ALL");
      yield put(subscriptionFulfilled(topicName));
    } catch (err) {
      yield call(logError, err);
      yield put(
        subscriptionRejected({
          name: topicName,
          error: err,
        }),
      );
    }
  }
}
