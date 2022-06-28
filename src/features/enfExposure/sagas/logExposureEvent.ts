import { createLogger } from "@logger/createLogger";
import { NativeEventEmitter } from "react-native";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { call, take } from "redux-saga/effects";

import config from "../../../config";

const exposureNotification = ExposureNotificationModule as any;
const emitter = new NativeEventEmitter(exposureNotification);

const { logInfo, logError } = createLogger("ExposureEvent");

function exposureEventChannel() {
  return eventChannel<string>((emit) => {
    const listener = (val: any) => {
      try {
        const eventString = JSON.stringify(val);
        emit(eventString);
      } catch (error) {
        logError(error);
      }
    };

    const subscription = emitter.addListener("exposureEvent", listener);

    return () => {
      subscription.remove();
    };
  });
}

export function* logExposureEvent(): SagaIterator {
  if (!config.IsDev) {
    return;
  }

  const channel: EventChannel<string> = yield call(exposureEventChannel);

  while (true) {
    const event: string = yield take(channel);
    // Hide this for debug as it would create double logs
    if (!__DEV__) {
      logInfo(event);
    }
  }
}
