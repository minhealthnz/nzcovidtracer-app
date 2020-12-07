import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { deleteOldData } from "./deleteOldData";
import { deleteOldDataFromLegacyDb } from "./deleteOldDataFromLegacyDb";

export default function* sagaWatcher(): SagaIterator {
  yield all([call(deleteOldDataFromLegacyDb), call(deleteOldData)]);
}
