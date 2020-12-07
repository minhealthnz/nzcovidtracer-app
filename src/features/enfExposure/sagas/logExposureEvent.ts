import { createLogger } from "@logger/createLogger";
import { NativeEventEmitter } from "react-native";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { call, take } from "redux-saga/effects";

import config from "../../../config";

const emitter = new NativeEventEmitter(ExposureNotificationModule);

const { logInfo, logError } = createLogger("ExposureEvent");

function exposureEventChannel() {
  return eventChannel<string>((emit) => {
    const listener = (val: any) => {
      try {
        const eventString = JSON.stringify(val, null, 2);
        emit(eventString);
      } catch (error) {
        logError(error);
      }
    };

    const subscription = emitter.addListener("exposureEvent", listener);

    return () => {
      subscription.remove();
      emitter.removeListener("exposureEvent", listener);
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
    logInfo(event);
  }
}
