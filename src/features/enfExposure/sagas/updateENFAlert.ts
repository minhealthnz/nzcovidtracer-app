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

const { logError } = createLogger("saga/updateENFAlert");

export default function* updateENFAlert(
  action: PayloadAction<CloseContact[] | undefined>,
): SagaIterator {
  try {
    if (!action.payload) {
      yield put(setEnfAlert(undefined));
      return;
    }

    const contacts = action.payload;

    // no contacts, no alert
    if (!contacts.length) {
      yield put(setEnfAlert(undefined));
      return;
    }

    const exposureCount = contacts.length;

    const lastEnfAlertDismissDate: number = yield select(
      selectLastEnfAlertDismissDate,
    );

    // Find the most recent contact based on the exposure date
    const match = contacts.reduce<CloseContact | undefined>(
      (current, contact) => {
        const currentExposureDate = current
          ? moment(contact.exposureAlertDate)
              .subtract(contact.daysSinceLastExposure, "days")
              .valueOf()
          : 0;

        const exposureDate = moment(contact.exposureAlertDate)
          .subtract(contact.daysSinceLastExposure, "days")
          .valueOf();

        return exposureDate > lastEnfAlertDismissDate && // We are interested in the new exposures only (that happen since last dismiss)
          currentExposureDate < exposureDate
          ? contact
          : current;
      },
      undefined,
    );

    if (!match) {
      yield put(setEnfAlert(undefined));
      return;
    }

    // find corresponding alert configuration based on the risk score
    const riskBucketSelector = yield call(
      selectENFNotificationRiskBucket,
      match.maxRiskScore,
    ); // split factory selector into 2 effects call and select

    const riskBucket = yield select(riskBucketSelector);

    if (!riskBucket) {
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

    const alertDate = match.exposureAlertDate;

    const result: ENFAlertData = {
      exposureCount,
      alertDate,
      alertTitle: riskBucket.alertTitle,
      alertMessage: riskBucket.alertMessage,
      linkUrl: riskBucket.linkUrl,
      exposureDate: moment(alertDate)
        .subtract(match.daysSinceLastExposure, "days")
        .valueOf(),
    };

    const currentAlert: ENFAlertData = yield select(selectENFAlert);

    // put NEW alarm on the state and log an analytics event
    if (!_.isEqual(result, currentAlert)) {
      yield call(recordDisplayENFAlert, match);
      yield put(setEnfAlert(result));
    }
  } catch (error) {
    logError(error);
  }
}
