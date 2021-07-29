import { ReminderNotificationConfig } from "../reducer";
import { validateReminderNotificationConfig } from "./validateReminderConfig";

const regularConfig: ReminderNotificationConfig = {
  version: 1,
  notifications: [
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 5,
    },
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 15,
    },
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 25,
    },
  ],
};

const missingVersion = {
  notifications: [
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 5,
    },
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 15,
    },
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 25,
    },
  ],
};

const malformed1 = {
  version: 1,
  notifications: [
    1,
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: 15,
    },
  ],
};
const malformed2 = {
  version: 1,
  notifications: [
    1,
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      timingInMinutes: 15,
    },
  ],
};
const malformed3 = {
  version: 1,
  notifications: [
    {
      dashboardBody: "Test",
      dashboardTitle: "Test",
      diaryBody: "Test",
      diaryTitle: "Test",
      notificationMessage: "Test",
      timingInMinutes: "Test",
    },
  ],
};

const missingNotifications = { version: 3 };

describe("#validateReminderConfig", () => {
  it("parses correct config without changes", () => {
    const result = validateReminderNotificationConfig(regularConfig);
    expect(result).toEqual(regularConfig);
  });
  it("config with missing version returns undefined", () => {
    // @ts-ignore
    const result = validateReminderNotificationConfig(missingVersion);
    expect(result).toEqual(undefined);
  });
  it("returns undefined for completely different type", () => {
    // @ts-ignore
    const result = validateReminderNotificationConfig(5);
    expect(result).toEqual(undefined);
  });
  it("returns config with empty notifications and correct version for missing or empty notifications", () => {
    // @ts-ignore
    const result = validateReminderNotificationConfig(missingNotifications);
    expect(result).toEqual({ version: 3, notifications: [] });
  });
  it("returns undefined if there are any malformed notifications", () => {
    // @ts-ignore
    let result = validateReminderNotificationConfig(malformed1);
    expect(result).toEqual(undefined);
    // @ts-ignore
    result = validateReminderNotificationConfig(malformed2);
    expect(result).toEqual(undefined);
    // @ts-ignore
    result = validateReminderNotificationConfig(malformed3);
    expect(result).toEqual(undefined);
  });
});
