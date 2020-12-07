import { appDidBecomeAvailable } from "@domain/device/reducer";
import { expectSaga } from "redux-saga-test-plan";

import { deleteOldData } from "./deleteOldData";

it("delete old data", async () => {
  const removeCheckInItems = async () => {};
  const removeMatches = async () => {};
  await expectSaga(deleteOldData, removeCheckInItems, removeMatches)
    .call.fn(removeCheckInItems)
    .call.fn(removeMatches)
    .dispatch(appDidBecomeAvailable())
    .silentRun();
});
