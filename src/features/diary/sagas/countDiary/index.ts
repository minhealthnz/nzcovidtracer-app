import { all, call } from "redux-saga/effects";

import { countCurrentUser } from "./countCurentUser";
import { countCurrentUserActiveDays } from "./countCurentUserActiveDays";
import { countLegacyUsers } from "./countLegacyUsers";

export function* countDiary() {
  yield all([
    call(countCurrentUser),
    call(countLegacyUsers),
    call(countCurrentUserActiveDays),
  ]);
}
