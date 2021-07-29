import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  requestToggleAnnouncements,
  subscriptionFulfilled,
  subscriptionRejected,
  subscriptionRemoved,
} from "../reducer";
import { selectSubscriptions } from "../selectors";
import { subscribeTopic } from "../service/subscribeTopic";
import { unsubscribeTopic } from "../service/unsubscribeTopic";

const { logInfo, logError } = createLogger("device/toggledAnnouncements");

export function* toggleAnnouncements(): SagaIterator {
  yield takeLatest([requestToggleAnnouncements], onToggleAnnouncements);
}

function* onToggleAnnouncements({
  payload,
}: PayloadAction<boolean>): SagaIterator {
  const subscriptions = yield select(selectSubscriptions);

  if (payload) {
    // Subscribe
    try {
      yield call(subscribeTopic, "announcements");

      yield call(logInfo, "Subscribed to announcements");
      // Add to reducer of subscriptions.
      yield put(subscriptionFulfilled("announcements"));
    } catch (err) {
      // Show error toaster
      yield put(
        subscriptionRejected({
          name: "announcements",
          error: err,
        }),
      );
      yield call(logError, err);
    }
  } else {
    // Unsubscribe
    if (subscriptions.announcements?.fullfilled) {
      try {
        yield call(unsubscribeTopic, "announcements");
        yield call(logInfo, "Unsubscribed from announcements");
        // Remove from the reducer of subscriptions.
        yield put(subscriptionRemoved("announcements"));
      } catch (err) {
        // Error
        yield put(
          subscriptionRejected({
            name: "announcements",
            error: err,
          }),
        );
        yield call(logError, err);
      }
    }
  }
}
