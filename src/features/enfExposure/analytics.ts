import moment from "moment";
import { CloseContact } from "react-native-exposure-notification-service";

import { recordAnalyticEvent } from "../../analytics";
import { ENFEvent } from "./events";
import { ENFAlertData } from "./reducer";

export const recordDismissENFAlert = (enfAlert: ENFAlertData) => {
  recordAnalyticEvent(ENFEvent.ENFBannerDismissed, {
    metrics: {
      daysSinceReceived: moment().diff(enfAlert.alertDate, "days"),
    },
  });
};

export const recordDisplayENFAlert = (match: CloseContact) => {
  recordAnalyticEvent(ENFEvent.ENFBannerDisplayed, {
    attributes: {
      alertDate: moment(parseInt(match.exposureAlertDate, 10)).format(
        "DD MMM YYYY",
      ),
    },
    metrics: {
      riskScore: match.maxRiskScore,
      daysSinceLastExposure: match.daysSinceLastExposure,
      matchedKeyCount: match.matchedKeyCount,
    },
  });
};
