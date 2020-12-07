import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import { createAnonymousUser } from "./createAnonymousUser";
import { watchLoadLegacyUsers } from "./loadLegacyUsers";
import { watchMigrateSingleUser } from "./migrateSingleUser";
import { watchSetAlias } from "./setAlias";
import { watchSetNHI } from "./setNHI";
import { uploadDetails } from "./uploadDetails";

export default function* sagaWatcher(): SagaIterator {
  yield all([
    call(watchLoadLegacyUsers),
    call(createAnonymousUser),
    call(watchMigrateSingleUser),
    call(watchSetAlias),
    call(watchSetNHI),
    call(uploadDetails),
  ]);
}
