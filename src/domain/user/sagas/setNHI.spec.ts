import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga/effects";

import { setNHI, setNHIFulfilled, setNHIRejected } from "../reducer";
import { selectUserId } from "../selectors";
import { watchSetNHI } from "./setNHI";

describe("#setNHI", () => {
  it("sets NHI", async () => {
    const updateNHI = async () => {};
    const nhi = nanoid();
    const userId = nanoid();
    await expectSaga(watchSetNHI, updateNHI)
      .provide([[select(selectUserId), userId]])
      .put(setNHIFulfilled(nhi))
      .call(updateNHI, userId, nhi)
      .dispatch(setNHI(nhi))
      .silentRun();
  });
  it("emits error", async () => {
    const error = new Error("foo");
    const updateNHI = async () => {
      throw error;
    };
    const nhi = nanoid();
    const userId = nanoid();
    await expectSaga(watchSetNHI, updateNHI)
      .provide([[select(selectUserId), userId]])
      .put(setNHIRejected(error))
      .dispatch(setNHI(nhi))
      .silentRun();
  });
});
