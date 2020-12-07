import { getAll as dbGetAll } from "@db/user";
import { setUsersCopied } from "@features/migration/reducer";
import { logPerformance } from "@logger/logPerformance";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { setLegacyUsers } from "../reducer";
import { User } from "../types";

export function* watchLoadLegacyUsers(getAll = dbGetAll): SagaIterator {
  yield takeLatest(setUsersCopied, loadLegacyUsers, getAll);
}

export function* loadLegacyUsers(getAll: () => Promise<User[]>): SagaIterator {
  const users: User[] = yield call(getAll);
  yield put(setLegacyUsers(users.filter((x) => !x.isAnonymous)));
  logPerformance("launch", "load legacy users");
}
