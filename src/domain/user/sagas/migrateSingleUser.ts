import { setSessionType } from "@features/onboarding/reducer";
import { SessionType } from "@features/onboarding/types";
import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { setAlias, setAnonymousUser, setLegacyUsers, setNHI } from "../reducer";
import { User } from "../types";

const { logWarning } = createLogger("migrateSingleUser");

export function* watchMigrateSingleUser(): SagaIterator {
  const actions: {
    setSessionType: PayloadAction<SessionType>;
    setLegacyUsers: PayloadAction<User[]>;
    setAnonymousUser: PayloadAction<User>;
  } = yield all({
    setSessionType: take(setSessionType.type),
    setLegacyUsers: take(setLegacyUsers.type),
    setAnonymousUser: take(setAnonymousUser.type),
  });

  const sessionType = actions.setSessionType.payload;
  const legacyUsers = actions.setLegacyUsers.payload;
  const anonymousUser = actions.setAnonymousUser.payload;

  if (sessionType !== "single") {
    return;
  }

  if (legacyUsers.length !== 1) {
    logWarning(
      `Expected exactly one legacy user, but got ${legacyUsers.length}`,
    );
    return;
  }

  yield call(migrateSingleUser, anonymousUser, legacyUsers[0]);
}

export function* migrateSingleUser(user: User, legacyUser: User): SagaIterator {
  yield put(
    setAlias({
      userId: legacyUser.id,
      alias: user.id,
    }),
  );

  if (user.nhi == null && legacyUser.nhi != null) {
    yield put(setNHI(legacyUser.nhi));
  }
}
