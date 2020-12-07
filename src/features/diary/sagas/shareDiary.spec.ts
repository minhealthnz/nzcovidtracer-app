import { CheckInItem, CheckInItemType } from "@db/checkInItem";
import { hashLocationNumber } from "@db/hash";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import {
  shareDiary as shareDiaryAction,
  shareDiaryFulfilled,
  shareDiaryRejected,
} from "../reducer";
import { selectUserIds } from "../selectors";
import { shareDiary } from "./shareDiary";

it("#shareDiary handles success", async () => {
  const {
    saga,
    userIds,
    queryAll,
    updateLocationItems,
    code,
    checkIns,
    requestId,
  } = setupSaga();

  await saga
    .call(queryAll, userIds)
    .call(updateLocationItems, code, checkIns)
    .put(shareDiaryFulfilled())
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
      }),
    )
    .silentRun();
});

it("#shareDiary handles query failure", async () => {
  const queryError = new Error("query error");
  const { saga, code, requestId } = setupSaga({
    queryError,
  });

  await saga.put
    .actionType(shareDiaryRejected.type)
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
      }),
    )
    .silentRun();
});

it("#shareDiary handles api failure", async () => {
  const updateError = new Error("api error");
  const { saga, code, requestId } = setupSaga({
    updateError,
  });

  await saga.put
    .actionType(shareDiaryRejected.type)
    .dispatch(
      shareDiaryAction({
        requestId,
        code,
      }),
    )
    .silentRun();
});

function setupSaga(options?: { queryError?: Error; updateError?: Error }) {
  const userId = nanoid();
  const globalLocationNumber = nanoid();
  const checkIns: CheckInItem[] = [
    {
      id: nanoid(),
      userId: userId,
      startDate: new Date(),
      name: "foo",
      address: "bar",
      globalLocationNumber,
      globalLocationNumberHash: hashLocationNumber(globalLocationNumber),
      type: CheckInItemType.Scan,
    },
  ];
  const queryAll = async () => {
    if (options?.queryError) {
      throw options.queryError;
    }
    return checkIns;
  };
  const updateLocationItems = async () => {
    if (options?.updateError) {
      throw options.updateError;
    }
  };
  const requestId = nanoid();
  const code = nanoid();
  const userIds = [userId];

  const saga = expectSaga(shareDiary, queryAll, updateLocationItems).provide([
    [select(selectUserIds), userIds],
  ]);

  return {
    requestId,
    queryAll,
    updateLocationItems,
    code,
    userIds,
    saga,
    checkIns,
  };
}
