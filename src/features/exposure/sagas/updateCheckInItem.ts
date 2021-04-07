import { findCheckInItem } from "@db/checkInItem";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { setMatchedCheckInItem } from "@features/diary/commonActions";
import { deleteEntry } from "@features/diary/reducer";
import {
  selectEndDate,
  selectGlobalLocationHash,
  selectStartDate,
} from "@features/exposure/selectors";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { setMatch } from "../reducer";

const { logError } = createLogger("saga/mapCheckInItem");

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export function* updateCheckInItem(): SagaIterator {
  yield takeLatest(
    [appDidBecomeAvailable, setMatch, deleteEntry.fulfilled],
    onUpdateCheckInItem,
  );
}

function* onUpdateCheckInItem(): SagaIterator {
  const globalLocationHash = yield select(selectGlobalLocationHash);
  const startDate = yield select(selectStartDate);
  const endDate = yield select(selectEndDate);

  if (globalLocationHash == null) {
    return;
  }
  try {
    const items: AsyncReturnType<typeof findCheckInItem> = yield call(
      findCheckInItem,
      globalLocationHash,
      startDate,
      endDate,
    );
    yield put(setMatchedCheckInItem(items));
  } catch (err) {
    yield call(logError, err);
  }
}
