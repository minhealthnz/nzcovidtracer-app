import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import { updateReminderNotificationConfig } from "../commonActions";
import {
  ReminderNotificationConfig,
  setReminderNotificationConfig,
} from "../reducer";
import { selectReminderNotificationConfig } from "../selectors";
import { updateReminderConfig } from "./updateReminderConfig";

const currentConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [
    {
      notificationMessage: "Test 1",
      timingInMinutes: 10,
      dashboardTitle: "Test",
      dashboardBody: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
    },
  ],
};

const reminderConfig: ReminderNotificationConfig = {
  version: 2,
  notifications: [
    {
      notificationMessage: "Test",
      timingInMinutes: 5,
      dashboardTitle: "Test",
      dashboardBody: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
    },
  ],
};

const sameVersionConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [
    {
      notificationMessage: "Test",
      timingInMinutes: 5,
      dashboardTitle: "Test",
      dashboardBody: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
    },
  ],
};

const emptyConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [],
};

describe("#updateReminderConfig", () => {
  it("updates reminder config", async () => {
    await expectSaga(updateReminderConfig)
      .put(setReminderNotificationConfig(reminderConfig))
      .provide([[select(selectReminderNotificationConfig), currentConfig]])
      .dispatch(updateReminderNotificationConfig(reminderConfig))
      .silentRun();
  });

  it("doesn't update config if remote version is not newer than local one", async () => {
    await expectSaga(updateReminderConfig)
      .not.put(setReminderNotificationConfig(sameVersionConfig))
      .provide([[select(selectReminderNotificationConfig), currentConfig]])
      .dispatch(updateReminderNotificationConfig(sameVersionConfig))
      .silentRun();
  });

  it("adds empty config, if api returns empty", async () => {
    await expectSaga(updateReminderConfig)
      .put(setReminderNotificationConfig(emptyConfig))
      .provide([[select(selectReminderNotificationConfig), currentConfig]])
      .dispatch(updateReminderNotificationConfig(emptyConfig))
      .silentRun();
  });

  it("adds empty config, if api returns nothing", async () => {
    await expectSaga(updateReminderConfig)
      .put(setReminderNotificationConfig(emptyConfig))
      .provide([[select(selectReminderNotificationConfig), currentConfig]])
      .dispatch(updateReminderNotificationConfig(undefined))
      .silentRun();
  });
});
