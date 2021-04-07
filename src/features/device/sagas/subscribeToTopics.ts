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

export function* subscribeToTopics(): SagaIterator {
  yield takeLatest(
    [setNotificationPermission, appDidBecomeAvailable],
    onSubcribeToTopics,
  );
}

export function* onSubcribeToTopics(): SagaIterator {
  const status: PermissionStatus = yield select(selectNotificationPermission);

  if (status !== "granted") {
    return;
  }

  yield call(subscribeToTopic, "all");
  yield call(subscribeToTopic, "announcements");
}

export function* subscribeToTopic(topicName: string): SagaIterator {
  const subscriptions: ReturnType<typeof selectSubscriptions.resultFunc> = yield select(
    selectSubscriptions,
  );

  if (subscriptions[topicName]?.fullfilled) {
    logInfo(`already subscribed ${topicName}, skip`);
    return;
  }

  const fcm = messaging();
  try {
    yield call([fcm, fcm.subscribeToTopic], topicName);
    yield call(logInfo, `Subscribed to ${topicName}`);
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
