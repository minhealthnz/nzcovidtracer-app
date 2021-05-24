import { expectSaga } from "redux-saga-test-plan";

import { setCurrentDate } from "../reducer";
import { onUpdateCurrentDate } from "./updateCurrentDate";

const cases = [
  [
    new Date("2012-03-04T05:03:30.123Z").getTime(),
    new Date("2012-03-04T05:04:00.000Z").getTime(),
    29877,
  ],
  [
    new Date("2012-03-04T05:03:29.999Z").getTime(),
    new Date("2012-03-04T05:04:00.000Z").getTime(),
    30001,
  ],
  [
    new Date("2012-03-04T05:03:00.000Z").getTime(),
    new Date("2012-03-04T05:04:00.000Z").getTime(),
    60000,
  ],
  [
    new Date("2012-03-04T05:03:59.999Z").getTime(),
    new Date("2012-03-04T05:04:00.000Z").getTime(),
    1,
  ],
];

describe("#updateCurrentDate", () => {
  it.each(cases)(
    "should update currentDate at the start of every minute",
    async (currentDate, nextMinute, delayedTime) => {
      const delayFunc = jest.fn();

      await expectSaga(onUpdateCurrentDate, currentDate, delayFunc)
        .put(setCurrentDate(nextMinute))
        .silentRun();

      // called once with ms until next minute
      expect(delayFunc.mock.calls.length).toBe(1);
      expect(delayFunc.mock.calls[0][0]).toBe(delayedTime);
    },
  );
});
