import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment-timezone";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

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
import { DiaryEntry } from "../types";

const { logWarning } = createLogger("saga/shareDiary");

export function* shareDiary(
  updateLocationHistory = _updateLocationHistory,
): SagaIterator {
  yield takeLatest(shareDiaryAction, onShareDiary, updateLocationHistory);
}

function* onShareDiary(
  updateLocationHistory: (code: string, items: DiaryEntry[]) => Promise<void>,
  { payload }: PayloadAction<ShareDiary>,
): SagaIterator {
  const { code, items } = payload;

  if (items.length === 0) {
    logWarning("No items to share");
    yield put(
      shareDiaryRejected({
        message: "errors:dataRequestCode:atleast1Item",
      }),
    );
    return;
  } else {
    try {
      yield call(updateLocationHistory, code, items);
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
}

async function _updateLocationHistory(
  code: string,
  checkIns: DiaryEntry[],
): Promise<void> {
  const payload = checkIns.map((item) => {
    const { startDate, name, globalLocationNumber, details, type } = item;
    return {
      gln: globalLocationNumber,
      locationName: name,
      note: details,
      entryType:
        type === "manual" ? LocationItemType.Manual : LocationItemType.Scanned,
      time: moment(startDate).toISOString(),
    };
  });
  await apiUpdateLocationHistory(code, payload);
}
