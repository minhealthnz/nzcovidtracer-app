import moment from "moment";

import { InAppReminder } from "../reducer";
import { getUpdatedInAppReminders } from "./getUpdatedInAppReminders";

const scheduledReminders1: InAppReminder[] = [
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(2, "days").toDate(),
  },
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(3, "days").toDate(),
  },
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(4, "days").toDate(),
  },
];

const reminderToDisplay: InAppReminder = {
  dashboardBody: "Test",
  dashboardTitle: "Test",
  diaryTitle: "Test",
  diaryBody: "Test",
  dateTime: moment().add(-2, "days").toDate(),
};

const futureReminder: InAppReminder = {
  dashboardBody: "Test",
  dashboardTitle: "Test",
  diaryTitle: "Test",
  diaryBody: "Test",
  dateTime: moment().add(4, "days").toDate(),
};

const scheduledReminders2: InAppReminder[] = [
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(-3, "days").toDate(),
  },
  reminderToDisplay,
  futureReminder,
];

const scheduledReminders3: InAppReminder[] = [
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(-4, "days").toDate(),
  },
  {
    dashboardBody: "Test",
    dashboardTitle: "Test",
    diaryTitle: "Test",
    diaryBody: "Test",
    dateTime: moment().add(-3, "days").toDate(),
  },
  reminderToDisplay,
];

describe("#getUpdatedInAppReminders", () => {
  it("should return undefined when all scheduled reminders in the future", () => {
    const result = getUpdatedInAppReminders(scheduledReminders1);
    expect(result).toEqual(undefined);
  });
  it("should return undefined when no scheduled reminders", () => {
    const result = getUpdatedInAppReminders([]);
    expect(result).toEqual(undefined);
  });
  it("should return future most current reminder and list with all past reminders removed", () => {
    const result = getUpdatedInAppReminders(scheduledReminders2);
    expect(result).toEqual({
      displayReminder: reminderToDisplay,
      updatedReminders: [futureReminder],
    });
  });
  it("should return future most current reminder and empty list when all reminders in past", () => {
    const result = getUpdatedInAppReminders(scheduledReminders3);
    expect(result).toEqual({
      displayReminder: reminderToDisplay,
      updatedReminders: [],
    });
  });
});
