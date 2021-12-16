import { expectSaga } from "redux-saga-test-plan";

import { cancelReminders as cancelAction } from "../commonActions";
import { clearScheduledInAppReminders, dismissInAppReminder } from "../reducer";
import { cancelReminders as cancelService } from "../service/cancelReminders";
import { cancelReminders } from "./cancelReminders";

jest.mock("../service/cancelReminders");

describe("#cancelReminders", () => {
  it("should cancel reminder notifications and in app reminders", async () => {
    expectSaga(cancelReminders)
      .call(cancelService)
      .put(clearScheduledInAppReminders())
      .put(dismissInAppReminder())
      .dispatch(cancelAction)
      .silentRun();
  });
});
