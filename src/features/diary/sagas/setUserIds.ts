import {
  setAliasFulfilled,
  setAnonymousUser,
  setLegacyUsers,
} from "@domain/user/reducer";
import { selectLegacyUsers, selectUser } from "@domain/user/selectors";
import { User } from "@domain/user/types";
import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";

import { setUserIds } from "../reducer";

export function* watchUpdateUserIds(): SagaIterator {
  yield takeLatest(
    [setAnonymousUser, setLegacyUsers, setAliasFulfilled],
    updateUserIds,
  );
}

export function* updateUserIds(): SagaIterator {
  const user: User = yield select(selectUser);
  const legacyUsers: User[] = yield select(selectLegacyUsers);

  const ids = [
    user.id,
    ...legacyUsers.filter((x) => x.alias === user.id).map((x) => x.id),
  ];

  yield put(setUserIds(ids));
}
