import { countActiveDays } from "@db/entities/checkInItem";
import { setAnonymousUser } from "@domain/user/reducer";
import { selectUserId } from "@domain/user/selectors";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  addEntry,
  deleteEntry,
  editEntry,
  setCountActiveDays,
} from "../../reducer";

const { logError } = createLogger("saga/countDiary7Days");

export function* countCurrentUserActiveDays(): SagaIterator {
  yield takeLatest(
    [
      appDidBecomeAvailable,
      setAnonymousUser,
      addEntry.fulfilled,
      deleteEntry.fulfilled,
      editEntry.fulfilled,
    ],
    onCountCurrentUserActiveDays,
  );
}

function* onCountCurrentUserActiveDays(): SagaIterator {
  const userId = yield select(selectUserId);
  if (userId == null) {
    return;
  }
  try {
    const number = yield call(countActiveDays, userId);
    yield put(setCountActiveDays({ userId, count: number }));
  } catch (err) {
    yield call(logError, err);
  }
}
