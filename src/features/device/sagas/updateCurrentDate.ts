import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, delay, put } from "redux-saga/effects";

import { setCurrentDate } from "../reducer";

const { logError } = createLogger("device/updateCurrentDate");

export function* updateCurrentDate(): SagaIterator {
  try {
    while (true) {
      const currentDate = new Date().getTime();
      yield call(onUpdateCurrentDate, currentDate);
    }
  } catch (err) {
    logError(err);
  }
}

// update the current date at the start of every minute.
export function* onUpdateCurrentDate(
  now: number,
  delayFunc = delay,
): SagaIterator {
  const minute = 60000;
  const wait = minute - (now % minute);
  yield delayFunc(wait);

  const nextMinute = now + wait;
  yield put(setCurrentDate(nextMinute));
}
