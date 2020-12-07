import {
  setAlias,
  setAliasFulfilled,
  setAliasRejected,
} from "@domain/user/reducer";
import { selectUserId } from "@domain/user/selectors";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import { copyDiary as copyDiaryAction, copyDiaryRejected } from "../reducer";
import { copyDiary } from "./copyDiary";

describe("#copyDiary", () => {
  it("copies diaries", async () => {
    const legacyUserId = nanoid();
    const request = {
      requestId: nanoid(),
      userId: legacyUserId,
      email: `${nanoid()}@gmail.com`,
      isOnboarding: false,
    };
    const userId = nanoid();
    await expectSaga(copyDiary)
      .provide([[select(selectUserId), userId]])
      .put(
        setAlias({
          userId: request.userId,
          alias: userId,
        }),
      )
      .dispatch(copyDiaryAction(request))
      .dispatch(
        setAliasFulfilled({
          userId: request.userId,
          alias: userId,
        }),
      )
      .silentRun();
  });
  it("dispatches error when setAlias fails", async () => {
    const legacyUserId = nanoid();
    const request = {
      requestId: nanoid(),
      userId: legacyUserId,
      email: `${nanoid()}@gmail.com`,
      isOnboarding: false,
    };
    const userId = nanoid();
    await expectSaga(copyDiary)
      .provide([[select(selectUserId), userId]])
      .put(
        setAlias({
          userId: request.userId,
          alias: userId,
        }),
      )
      .put.actionType(copyDiaryRejected.type)
      .dispatch(copyDiaryAction(request))
      .dispatch(setAliasRejected(new Error("foo")))
      .silentRun();
  });
});
