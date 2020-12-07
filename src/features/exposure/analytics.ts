import { CheckInItemMatch } from "@db/checkInItemMatch";

import { AnalyticsEvent, recordAnalyticEvent } from "../../analytics";

export const recordDismissLocationAlert = (exposureMatch: CheckInItemMatch) => {
  if (exposureMatch.callbackRequested) {
    recordAnalyticEvent(AnalyticsEvent.DismissCardAfterCallbackRequest);
  } else {
    recordAnalyticEvent(AnalyticsEvent.DismissCardBeforeCallbackRequest);
  }
};
