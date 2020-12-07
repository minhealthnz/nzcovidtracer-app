import { all, call } from "redux-saga/effects";

import { countCurrentUser } from "./countCurentUser";
import { countLegacyUsers } from "./countLegacyUsers";

export function* countDiary() {
  yield all([call(countCurrentUser), call(countLegacyUsers)]);
}
