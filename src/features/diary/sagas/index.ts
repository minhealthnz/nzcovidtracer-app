import { all, call } from "redux-saga/effects";

import { copyDiary } from "./copyDiary";
import { countDiary } from "./countDiary";
import { pagination } from "./pagination";
import { previewDiary } from "./previewDiary";
import { watchUpdateUserIds } from "./setUserIds";
import { shareDiary } from "./shareDiary";

export default function* watchSaga() {
  yield all([
    call(watchUpdateUserIds),
    call(pagination),
    call(shareDiary),
    call(previewDiary),
    call(copyDiary),
    call(countDiary),
  ]);
}
