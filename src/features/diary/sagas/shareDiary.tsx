import {
  ALL,
  CheckInItem,
  CheckInItemType,
  query,
} from "@db/entities/checkInItem";
import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  errors,
  LocationItemType,
  updateLocationHistory as apiUpdateLocationHistory,
} from "../api";
import {
  ShareDiary,
  shareDiary as shareDiaryAction,
  shareDiaryFulfilled,
  shareDiaryRejected,
} from "../reducer";
import { selectUserIds } from "../selectors";

const { logWarning } = createLogger("saga/shareDiary");

export function* shareDiary(
  queryAll = _queryAll,
  updateLocationHistory = _updateLocationHistory,
): SagaIterator {
  yield takeLatest(
    shareDiaryAction,
    onShareDiary,
    queryAll,
    updateLocationHistory,
  );
}

function* onShareDiary(
  queryAll: (userIds: string[]) => Promise<CheckInItem[]>,
  updateLocationHistory: (code: string, items: CheckInItem[]) => Promise<void>,
  { payload }: PayloadAction<ShareDiary>,
): SagaIterator {
  const code = payload.code;
  const userIds = yield select(selectUserIds);
  try {
    const checkIns: CheckInItem[] = yield call(queryAll, userIds);
    yield call(updateLocationHistory, code, checkIns);
    yield put(shareDiaryFulfilled());
  } catch (err) {
    yield call(logWarning, err);
    if (
      err.response?.data?.type === errors.validation &&
      err.response?.data?.errors?.ConsentCode
    ) {
      yield put(
        shareDiaryRejected({
          message: "errors:dataRequestCode:incorrectCode",
        }),
      );
    } else if (isNetworkError(err)) {
      yield put(
        shareDiaryRejected({
          message: "errors:dataRequestCode:network",
          isToast: true,
        }),
      );
    } else {
      yield put(shareDiaryRejected({ message: "errors:generic" }));
    }
  }
}

async function _queryAll(userIds: string[]): Promise<CheckInItem[]> {
  return await query(userIds, new Date(), ALL);
}

async function _updateLocationHistory(
  code: string,
  checkIns: CheckInItem[],
): Promise<void> {
  const payload = checkIns.map((x) => ({
    gln: x.location.globalLocationNumber || undefined,
    locationName: x.location.name,
    note: x.note || "",
    entryType: mapType(x.type),
    time: moment(x.startDate).toISOString(),
  }));
  await apiUpdateLocationHistory(code, payload);
}

function mapType(type: CheckInItemType): LocationItemType {
  switch (type) {
    case CheckInItemType.Scan:
      return LocationItemType.Scanned;
    case CheckInItemType.Manual:
      return LocationItemType.Manual;
    case CheckInItemType.NFC:
      return LocationItemType.Scanned;
  }
}
