import { query } from "@db/entities/checkInItem";
import { addEvents } from "@features/exposure/reducer";
import { ExposureEvent } from "@features/exposure/service/types";
import { _storeRef } from "@lib/storeRefs";
import { nanoid } from "@reduxjs/toolkit";

import { TestCommand } from "../testCommand";

export const buildCreateExposureEvent = (
  callbackRequested: boolean,
): TestCommand => ({
  command: "createExposureEvent",
  title: "Simulate exposure match",
  description: callbackRequested
    ? "Request callback enabled"
    : "Request callback disabled",
  async run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Cannot find store");
    }
    const checkIns = await query(undefined, new Date(), 1);
    if (checkIns.length === 0) {
      throw new Error("Please create at least one check-in");
    }
    const checkIn = checkIns[0];
    const event: ExposureEvent = {
      notificationId: nanoid(),
      eventId: nanoid(),
      start: new Date(checkIn.startDate.getTime() - 1),
      end: new Date(checkIn.startDate.getTime() + 1),
      glnHash: checkIn.location.globalLocationNumberHash,
      systemNotificationBody:
        "You may have been in contact with COVID-19. Tap for more information.",
      appBannerRequestCallbackEnabled: callbackRequested,
    };

    const params = {
      events: [event],
      defaultSystemNotificationBody:
        "You may have been in contact with COVID-19. Tap for more information.",
    };
    // @ts-ignore
    store.dispatch(addEvents(params));
  },
});
