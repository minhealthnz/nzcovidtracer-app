import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";

import {
  shareDiary as shareDiaryAction,
  shareDiaryFulfilled,
  shareDiaryRejected,
} from "../reducer";
import { buildRandomEntries } from "../reducer.spec";
import { shareDiary } from "./shareDiary";

it("#shareDiary handles success", async () => {
  const { saga, updateLocationItems, code, items, requestId } = setupSaga();

  await saga
    .call(updateLocationItems, code, items)
    .put(shareDiaryFulfilled())
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
        items,
      }),
    )
    .silentRun();
});

it("#shareDiary handles no items error", async () => {
  const { saga, code, requestId } = setupSaga();

  await saga.put
    .actionType(shareDiaryRejected.type)
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
        items: [],
      }),
    )
    .silentRun();
});

it("#shareDiary handles api failure", async () => {
  const updateError = new Error("api error");
  const { saga, code, requestId, items } = setupSaga({
    updateError,
  });

  await saga.put
    .actionType(shareDiaryRejected.type)
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
        items,
      }),
    )
    .silentRun();
});

function setupSaga(options?: { updateError?: Error }) {
  const items = buildRandomEntries();

  const updateLocationItems = async () => {
    if (options?.updateError) {
      throw options.updateError;
    }
  };
  const requestId = nanoid();
  const code = nanoid();

  const saga = expectSaga(shareDiary, updateLocationItems);

  return {
    requestId,
    updateLocationItems,
    code,
    saga,
    items,
  };
}
