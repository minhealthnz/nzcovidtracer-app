import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { copyCheckIns } from "./copyCheckIns";
import { copyMatches } from "./copyMatches";
import { copyUsers } from "./copyUsers";

export default function* sagaWatcher(): SagaIterator {
  yield all([call(copyUsers), call(copyCheckIns), call(copyMatches)]);
}
