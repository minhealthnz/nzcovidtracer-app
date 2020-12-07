import { all, call } from "redux-saga/effects";

import { handleError } from "./handleError";
import { previewDiary as _previewDiary } from "./previewDiary";

export function* previewDiary() {
  yield all([call(_previewDiary), call(handleError)]);
}
