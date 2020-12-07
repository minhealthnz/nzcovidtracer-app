import { count } from "@db/checkInItem";
import { appDidBecomeAvailable } from "@domain/device/reducer";
import { setAnonymousUser } from "@domain/user/reducer";
import { selectUserId } from "@domain/user/selectors";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { addEntry, deleteEntry, setCount } from "../../reducer";

const { logError } = createLogger("saga/countDiary");

export function* countCurrentUser(): SagaIterator {
  yield takeLatest(
    [
      appDidBecomeAvailable,
      setAnonymousUser,
      addEntry.fulfilled,
      deleteEntry.fulfilled,
    ],
    onCountCurrentUser,
  );
}

function* onCountCurrentUser(): SagaIterator {
  const userId = yield select(selectUserId);
  if (userId == null) {
    return;
  }
  try {
    const number = yield call(count, userId);
    yield put(setCount({ userId, count: number }));
  } catch (err) {
    yield call(logError, err);
  }
}
