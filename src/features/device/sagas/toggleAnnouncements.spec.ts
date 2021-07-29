import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import {
  requestToggleAnnouncements,
  subscriptionFulfilled,
  subscriptionRemoved,
} from "../reducer";
import { selectSubscriptions } from "../selectors";
import { subscribeTopic } from "../service/subscribeTopic";
import { unsubscribeTopic } from "../service/unsubscribeTopic";
import { toggleAnnouncements } from "./toggleAnnouncements";

jest.mock("../service/subscribeTopic");
jest.mock("../service/unsubscribeTopic");

describe("Opt in and out of announcement notifications", () => {
  test("Subscribing to announcements", async () => {
    await expectSaga(toggleAnnouncements)
      .provide([[select(selectSubscriptions), {}]])
      .call(subscribeTopic, "announcements")
      .put(subscriptionFulfilled("announcements"))
      .dispatch(requestToggleAnnouncements(true))
      .silentRun();
  });

  test("Unubscribing to announcements", async () => {
    await expectSaga(toggleAnnouncements)
      .provide([
        [select(selectSubscriptions), { announcements: { fullfilled: true } }],
      ])
      .call(unsubscribeTopic, "announcements")
      .put(subscriptionRemoved("announcements"))
      .dispatch(requestToggleAnnouncements(false))
      .silentRun();
  });
});
