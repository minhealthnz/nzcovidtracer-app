import { acknowledgeMatches } from "@features/exposure/reducer";
import PushNotification from "react-native-push-notification";
import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import { appDidBecomeAvailable } from "../reducer";

export function* resetBadgeNumber(): SagaIterator {
  yield takeLatest(
    [appDidBecomeAvailable.type, acknowledgeMatches.fulfilled],
    onResetBadgeNumber,
  );
}

function* onResetBadgeNumber() {
  yield call(
    [PushNotification, PushNotification.setApplicationIconBadgeNumber],
    0,
  );
}
