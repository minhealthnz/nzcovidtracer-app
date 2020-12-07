import moment from "moment";

import config from "../config";

export function calcCheckInMinDate() {
  return (
    moment()
      // The config value is subtracted to include the current day.
      .subtract(config.MaxCheckInDays - 1, "days")
      .startOf("day")
      .toDate()
  );
}

export function calcCheckInMaxDate() {
  return moment().endOf("day").toDate();
}
