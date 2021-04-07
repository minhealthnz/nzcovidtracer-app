import moment from "moment";

import { calculateExposureDate } from "./useEnfAlertDates";

const currentDate = new Date("2021-03-12T00:00:00.000Z");

const buildENFAlert = (enfAlert: any) => {
  return {
    alertTitle: "test",
    alertMessage: "test",
    linkUrl: "test",
    alertDate: moment("2021-03-09T00:00:00.000Z").valueOf(),
    exposureDate: moment("2021-03-09T00:00:00.000Z").valueOf(),
    exposureCount: 1,
    ...enfAlert,
  };
};

describe("useENFAlertDates", () => {
  it.each([
    [
      { exposureDate: moment("2021-03-09T00:00:00.000Z").valueOf() },
      {
        displayExposureDate: moment(
          moment("2021-03-09T00:00:00.000Z").valueOf(),
        ).add(1, "day"),
        daySinceLastExposure: 2,
        isRecentExposure: false,
      },
    ],
    [
      { exposureDate: moment("2021-03-10T00:00:00.000Z").valueOf() },
      {
        displayExposureDate: moment(
          moment("2021-03-10T00:00:00.000Z").valueOf(),
        ).add(1, "day"),
        daySinceLastExposure: 1,
        isRecentExposure: false,
      },
    ],
    [
      { exposureDate: moment("2021-03-11T00:00:00.000Z").valueOf() },
      {
        displayExposureDate: moment(
          moment("2021-03-11T00:00:00.000Z").valueOf(),
        ).add(1, "day"),
        daySinceLastExposure: 0,
        isRecentExposure: true,
      },
    ],
    [
      { exposureDate: moment("2021-03-12T00:00:00.000Z").valueOf() },
      {
        displayExposureDate: moment(
          moment("2021-03-12T00:00:00.000Z").valueOf(),
        ).add(1, "day"),
        daySinceLastExposure: -1,
        isRecentExposure: true,
      },
    ],
  ])("%s should match with %s", (input, output) => {
    const stats = calculateExposureDate(currentDate, buildENFAlert(input));
    expect(stats.daySinceLastExposure).toEqual(output.daySinceLastExposure);
    expect(stats.displayExposureDate.valueOf()).toEqual(
      output.displayExposureDate.valueOf(),
    );
    expect(stats.isRecentExposure).toEqual(output.isRecentExposure);
  });
});
