import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { checkSupported } from "./checkSupported";

export default function* watchSaga(): SagaIterator {
  yield all([call(checkSupported)]);
}
