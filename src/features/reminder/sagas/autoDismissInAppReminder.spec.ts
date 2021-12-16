import { addEntry } from "@features/diary/reducer";
import { expectSaga } from "redux-saga-test-plan";

import { dismissInAppReminder } from "../reducer";
import { autoDismissInAppReminder } from "./autoDismissInAppReminder";

describe("#autoDismissInAppReminder", () => {
  it("should dismiss in app reminder when diary entry was added", async () => {
    expectSaga(autoDismissInAppReminder)
      .put(dismissInAppReminder())
      .dispatch(addEntry.fulfilled)
      .silentRun();
  });
});
