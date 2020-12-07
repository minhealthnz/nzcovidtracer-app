import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";

import { setAlias, setAliasFulfilled, setAliasRejected } from "../reducer";
import { watchSetAlias } from "./setAlias";

describe("#setAlias", () => {
  it("sets alias", async () => {
    const updateAlias = async () => {};
    const payload = {
      userId: nanoid(),
      alias: nanoid(),
    };
    await expectSaga(watchSetAlias, updateAlias)
      .put(setAliasFulfilled(payload))
      .call(updateAlias, payload.userId, payload.alias)
      .dispatch(setAlias(payload))
      .silentRun();
  });
  it("emits error", async () => {
    const payload = {
      userId: nanoid(),
      alias: nanoid(),
    };
    const error = new Error("foo");
    const updateAlias = async () => {
      throw error;
    };
    await expectSaga(watchSetAlias, updateAlias)
      .put(setAliasRejected(error))
      .dispatch(setAlias(payload))
      .silentRun();
  });
});
