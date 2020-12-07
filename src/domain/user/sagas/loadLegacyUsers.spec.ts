import { setUsersCopied } from "@features/migration/reducer";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";

import { setLegacyUsers } from "../reducer";
import { User } from "../types";
import { watchLoadLegacyUsers } from "./loadLegacyUsers";

it("#loadLegacyUsers loads legacy users", async () => {
  const legacy = {
    id: nanoid(),
  };
  const anonymous = {
    id: nanoid(),
    isAnonymous: true,
  };
  const users: User[] = [legacy, anonymous];
  const getAll = async () => {
    return users;
  };

  await expectSaga(watchLoadLegacyUsers, getAll)
    .put(setLegacyUsers([legacy]))
    .call(getAll)
    .dispatch(setUsersCopied(true))
    .silentRun();
});
