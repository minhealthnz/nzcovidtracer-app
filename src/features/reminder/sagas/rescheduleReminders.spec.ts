import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import { rescheduleReminders as rescheduleAction } from "../commonActions";
import { ReminderNotificationConfig } from "../reducer";
import {
  selectIsEnabled,
  selectReminderNotificationConfig,
} from "../selectors";
import { cancelReminders } from "../service/cancelReminders";
import { scheduleReminders } from "../service/scheduleReminders";
import { rescheduleReminders } from "./rescheduleReminders";

jest.mock("../service/cancelReminders");

const currentConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [
    {
      notificationMessage: "Test 1",
      timingInMinutes: 10,
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
    },
  ],
};

const emptyConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [],
};

describe("#rescheduleReminders", () => {
  it("cancels reminders and schedules new ones", async () => {
    await expectSaga(rescheduleReminders)
      .provide([
        [select(selectIsEnabled), currentConfig],
        [select(selectReminderNotificationConfig), currentConfig],
      ])
      .call(cancelReminders)
      .call(scheduleReminders, currentConfig.notifications)
      .dispatch(rescheduleAction)
      .silentRun();
  });
  it("should do nothing if no notifications in config", async () => {
    await expectSaga(rescheduleReminders)
      .provide([
        [select(selectIsEnabled), emptyConfig],
        [select(selectReminderNotificationConfig), emptyConfig],
      ])
      .not.call(cancelReminders)
      .not.call(scheduleReminders, emptyConfig)
      .dispatch(rescheduleAction)
      .silentRun();
  });
});
