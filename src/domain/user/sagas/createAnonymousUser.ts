import { createAnonymousUser as dbCreateAnonymousUser } from "@db/user";
import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import { setAnonymousUser } from "../reducer";
import { User } from "../types";

function* createAnonymousUserSaga(
  createAnonymousUser = dbCreateAnonymousUser,
): SagaIterator {
  const anonymousUser: User = yield call(createAnonymousUser);
  yield put(setAnonymousUser(anonymousUser));
}

export { createAnonymousUserSaga as createAnonymousUser };
