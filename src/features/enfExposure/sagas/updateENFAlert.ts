import { createLogger } from "@logger/createLogger";
import { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import moment from "moment";
import { CloseContact } from "react-native-exposure-notification-service";
import { SagaIterator } from "redux-saga";
import { call, put, select } from "redux-saga/effects";

import { recordDisplayENFAlert } from "../analytics";
import { ENFAlertData, setEnfAlert } from "../reducer";
import {
  selectENFAlert,
  selectENFNotificationRiskBucket,
  selectLastEnfAlertDismissDate,
} from "../selectors";
import { defaultENFExpiresInDays } from "../util/defaultENFExpiresInDays";

const { logInfo, logError } = createLogger("saga/updateENFAlert");

const maxRiskScoreV2 = 540000;

export const getLatestMatch = (
  contacts: CloseContact[],
  lastEnfAlertDismissDate: number,
) => {
  const recentMatches = contacts.filter(
    (x) => x.exposureDate > lastEnfAlertDismissDate,
  );
  return _.maxBy(recentMatches, (x: CloseContact) => x.exposureDate);
};

export const countNumberOfExposures = (
  alertExpireInDays: number,
  contacts: CloseContact[],
) => {
  const alertExpiresInDays = defaultENFExpiresInDays(alertExpireInDays) + 1;
  return contacts.filter(
    (x) =>
      moment
        .duration(moment(new Date()).diff(moment(x.exposureDate)))
        .asDays() < alertExpiresInDays,
  ).length;
};

export default function* updateENFAlert(
  action: PayloadAction<CloseContact[] | undefined>,
): SagaIterator {
  try {
    logInfo(`update enf alert with payload: ${JSON.stringify(action.payload)}`);

    if (!action.payload) {
      logInfo("empty enf alert, abort");
      yield put(setEnfAlert(undefined));
      return;
    }

    const contacts = action.payload;

    // no contacts, no alert
    if (!contacts.length) {
      logInfo("no contacts, abort");
      yield put(setEnfAlert(undefined));
      return;
    }

    const lastEnfAlertDismissDate: number = yield select(
      selectLastEnfAlertDismissDate,
    );

    logInfo(`lastEnfAlertDismissDate: ${lastEnfAlertDismissDate}`);

    // Find the most recent contact based on the exposure date
    const match = getLatestMatch(contacts, lastEnfAlertDismissDate);

    logInfo(`reduced match ${JSON.stringify(match)}`);

    if (!match) {
      yield put(setEnfAlert(undefined));
      return;
    }

    // find corresponding alert configuration based on the risk score
    const riskBucketSelector = yield call(
      selectENFNotificationRiskBucket,
      Math.min(match.maxRiskScore, maxRiskScoreV2),
    ); // split factory selector into 2 effects call and select

    const riskBucket = yield select(riskBucketSelector);

    if (!riskBucket) {
      logInfo("no risk bucket found, abort");
      // If the exposure notification risk level does not fit into any buckets, then no alert is displayed
      // Heads-up: you will still receive exposure push notification!
      //
      // Also, if we decide to make "empty" risk buckets (confirming it now if we need it), for example
      // for the risk level 0..5, do not show alert at all, then this logic can be improved to handle the scenario:
      //  | an user receives 2 exposure notifications A (risk level 10) and B (risk level 5). B has the more recent
      //  |  exposure date but it won't be displayed as it doesn't fit any risk bucket. However with current
      //  |  implementation A won't be displayed as well and it can be improved.
      //
      yield put(setEnfAlert(undefined));
      return;
    }

    const exposureCount = countNumberOfExposures(
      riskBucket.alertExpiresInDays,
      contacts,
    );

    const alertDate = match.exposureAlertDate;

    const result: ENFAlertData = {
      exposureCount,
      alertDate,
      alertTitle: riskBucket.alertTitle,
      alertMessage: riskBucket.alertMessage,
      alertExpiresInDays: riskBucket.alertExpiresInDays,
      linkUrl: riskBucket.linkUrl,
      exposureDate: match.exposureDate,
    };

    const currentAlert: ENFAlertData = yield select(selectENFAlert);

    logInfo(`result: ${JSON.stringify(result)}`);

    // put NEW alarm on the state and log an analytics event
    if (!_.isEqual(result, currentAlert)) {
      yield call(recordDisplayENFAlert, match);
      yield put(setEnfAlert(result));
      logInfo("new alarm created");
    }
  } catch (error) {
    logError(error);
  }
}
