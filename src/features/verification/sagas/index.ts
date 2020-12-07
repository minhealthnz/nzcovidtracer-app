import { all, call } from "redux-saga/effects";

import { registerDevice } from "./registerDevice";

export default function* watchSaga() {
  yield all([call(registerDevice)]);
}
