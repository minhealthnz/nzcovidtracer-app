import { setSessionType } from "@features/onboarding/reducer";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";

import { setAlias, setAnonymousUser, setLegacyUsers, setNHI } from "../reducer";
import { watchMigrateSingleUser } from "./migrateSingleUser";

describe("migrateSingleUser", () => {
  it("sets alias", async () => {
    const anonymousUser = {
      id: nanoid(),
      isAnonymous: true,
    };
    const legacyUsers = [
      {
        id: nanoid(),
      },
    ];
    await expectSaga(watchMigrateSingleUser)
      .put(setAlias({ userId: legacyUsers[0].id, alias: anonymousUser.id }))
      .dispatch(setSessionType("single"))
      .dispatch(setAnonymousUser(anonymousUser))
      .dispatch(setLegacyUsers(legacyUsers))
      .silentRun();
  });
  it("sets nhi", async () => {
    const anonymousUser = {
      id: nanoid(),
      isAnonymous: true,
    };
    const legacyUsers = [
      {
        id: nanoid(),
        nhi: nanoid(),
      },
    ];
    await expectSaga(watchMigrateSingleUser)
      .put(setNHI(legacyUsers[0].nhi))
      .dispatch(setSessionType("single"))
      .dispatch(setAnonymousUser(anonymousUser))
      .dispatch(setLegacyUsers(legacyUsers))
      .silentRun();
  });
  it("skips setting nhi if nhi already exists", async () => {
    const anonymousUser = {
      id: nanoid(),
      isAnonymous: true,
      nhi: nanoid(),
    };
    const legacyUsers = [
      {
        id: nanoid(),
        nhi: nanoid(),
      },
    ];
    await expectSaga(watchMigrateSingleUser)
      .not.put.actionType(setNHI.type)
      .dispatch(setSessionType("single"))
      .dispatch(setAnonymousUser(anonymousUser))
      .dispatch(setLegacyUsers(legacyUsers))
      .silentRun();
  });
  it("skips none single sessions", async () => {
    const anonymousUser = {
      id: nanoid(),
      isAnonymous: true,
    };
    const legacyUsers = [
      {
        id: nanoid(),
      },
    ];
    await expectSaga(watchMigrateSingleUser)
      .not.put.actionType(setAlias.type)
      .not.put.actionType(setNHI.type)
      .dispatch(setSessionType("multi"))
      .dispatch(setAnonymousUser(anonymousUser))
      .dispatch(setLegacyUsers(legacyUsers))
      .silentRun();
  });
});
