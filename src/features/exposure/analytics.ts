import { CheckInItemMatch } from "@db/entities/checkInItemMatch";

import { recordAnalyticEvent } from "../../analytics";
import { ExposureEvents } from "./events";

export const recordDismissLocationAlert = (exposureMatch: CheckInItemMatch) => {
  if (exposureMatch.callbackRequested) {
    recordAnalyticEvent(ExposureEvents.DismissCardAfterCallbackRequest);
  } else {
    recordAnalyticEvent(ExposureEvents.DismissCardBeforeCallbackRequest);
  }
};

export const recordCallbackRequested = (alertType: "location" | "enf") => {
  recordAnalyticEvent(ExposureEvents.CallbackRequested, {
    attributes: {
      alertType,
    },
  });
};

export const recordCallbackSendPressed = (alertType: "location" | "enf") => {
  recordAnalyticEvent(ExposureEvents.CallbackSendPressed, {
    attributes: {
      alertType,
    },
  });
};

export const recordCallbackSubmitPressed = (alertType: "location" | "enf") => {
  recordAnalyticEvent(ExposureEvents.CallbackSubmitPressed, {
    attributes: {
      alertType,
    },
  });
};
