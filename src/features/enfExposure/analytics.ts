import moment from "moment-timezone";
import { CloseContact } from "react-native-exposure-notification-service";

import { recordAnalyticEvent } from "../../analytics";
import { ENFEvent } from "./events";

export const recordDisplayENFAlert = (match: CloseContact) => {
  recordAnalyticEvent(ENFEvent.ENFBannerDisplayed, {
    attributes: {
      alertDate: moment(match.exposureAlertDate).format("DD MMM YYYY"),
    },
    metrics: {
      riskScore: match.maxRiskScore,
      daysSinceLastExposure: match.daysSinceLastExposure,
      matchedKeyCount: match.matchedKeyCount,
    },
  });
};
