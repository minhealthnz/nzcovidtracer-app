import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { delay, put } from "redux-saga/effects";

import { setCurrentDate } from "../reducer";

const { logError } = createLogger("device/updateCurrentDate");

export function* updateCurrentDate(): SagaIterator {
  try {
    while (true) {
      yield delay(60000);
      const currentDate = new Date().getTime();
      yield put(setCurrentDate(currentDate));
    }
  } catch (err) {
    logError(err);
  }
}
