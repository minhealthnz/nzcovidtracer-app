import moment from "moment";
import { CloseContact } from "react-native-exposure-notification-service";
import { expectSaga } from "redux-saga-test-plan";
import { call, select } from "redux-saga-test-plan/matchers";

import enfConfig from "../../../__fixtures__/enfNotificationConfig";
import { ENFAlertData, setEnfAlert } from "../reducer";
import {
  selectENFAlert,
  selectENFNotificationRiskBucket,
  selectLastEnfAlertDismissDate,
} from "../selectors";
import updateENFAlert from "./updateENFAlert";

const CONTACT1: CloseContact = {
  exposureAlertDate: moment("2020-11-10T00:00:00.000Z").valueOf().toString(),
  daysSinceLastExposure: 2,
  attenuationDurations: [],
  matchedKeyCount: 1,
  maxRiskScore: 10,
  summationRiskScore: 10,
};

// the most recent exposure date, alert date is between contact1 and 3
const CONTACT2 = {
  maxRiskScore: 120,
  exposureAlertDate: moment("2020-11-15T00:00:00.000Z").valueOf().toString(),
  daysSinceLastExposure: 2,
  attenuationDurations: [],
  matchedKeyCount: 1,
  summationRiskScore: 120,
};

// this one has the most recent alert date, but not recent exposure date
const CONTACT3 = {
  ...CONTACT1,
  maxRiskScore: 10,
  exposureAlertDate: moment("2020-11-20T00:00:00.000Z").valueOf().toString(),
  daysSinceLastExposure: 10,
  matchedKeyCount: 2,
};

const DATE_BEFORE_CONTACT1 = moment("2020-11-05T00:00:00.000Z").valueOf();
const DATE_AFTER_CONTACT1 = moment("2020-11-10T12:00:00.000Z").valueOf();

const RESULT_FROM_CONTACT1_BUCKET0: ENFAlertData = {
  alertTitle: enfConfig[0].alertTitle,
  alertMessage: enfConfig[0].alertMessage,
  linkUrl: enfConfig[0].linkUrl,
  alertDate: parseInt(CONTACT1.exposureAlertDate, 10),
  exposureDate: moment(parseInt(CONTACT1.exposureAlertDate, 10))
    .subtract(CONTACT1.daysSinceLastExposure, "days")
    .valueOf(),
  exposureCount: 1,
};

const RESULT_FROM_CONTACT2_BUCKET2: ENFAlertData = {
  alertTitle: enfConfig[2].alertTitle,
  alertMessage: enfConfig[2].alertMessage,
  linkUrl: enfConfig[2].linkUrl,
  alertDate: parseInt(CONTACT2.exposureAlertDate, 10),
  exposureDate: moment(parseInt(CONTACT2.exposureAlertDate, 10))
    .subtract(CONTACT2.daysSinceLastExposure, "days")
    .valueOf(),
  exposureCount: 1,
};

const RESULT_FROM_CONTACT2_BUCKET2_1: ENFAlertData = {
  alertTitle: enfConfig[2].alertTitle,
  alertMessage: enfConfig[2].alertMessage,
  linkUrl: enfConfig[2].linkUrl,
  alertDate: parseInt(CONTACT2.exposureAlertDate, 10),
  exposureDate: moment(parseInt(CONTACT2.exposureAlertDate, 10))
    .subtract(CONTACT2.daysSinceLastExposure, "days")
    .valueOf(),
  exposureCount: 3,
};

const riskBucketSelector = () => {};

describe("#updateENFAlert", () => {
  it("should show no alert if there are no contacts available", async () => {
    await expectSaga(updateENFAlert, { type: "action", payload: [] })
      .put(setEnfAlert(undefined))
      .silentRun();
  });

  it("should show no alert if there are no more new contacts since last dismiss", async () => {
    await expectSaga(updateENFAlert, {
      type: "action",
      payload: [CONTACT1],
    })
      .provide([
        [select(selectLastEnfAlertDismissDate), DATE_AFTER_CONTACT1],
        [select(selectENFAlert), undefined],
        [
          call(selectENFNotificationRiskBucket, CONTACT1.maxRiskScore),
          riskBucketSelector,
        ],
        [select(riskBucketSelector), enfConfig[0]],
      ])
      .put(setEnfAlert(undefined))
      .silentRun();
  });

  it("should display the alert if there is unacknowledged contact", async () => {
    await expectSaga(updateENFAlert, {
      type: "action",
      payload: [CONTACT1],
    })
      .provide([
        [select(selectLastEnfAlertDismissDate), DATE_BEFORE_CONTACT1],
        [select(selectENFAlert), undefined],
        [
          call(selectENFNotificationRiskBucket, CONTACT1.maxRiskScore),
          riskBucketSelector,
        ],
        [select(riskBucketSelector), enfConfig[0]],
      ])
      .put(setEnfAlert(RESULT_FROM_CONTACT1_BUCKET0))
      .silentRun();
  });

  it("title and body copy should be configurable based on risk score buckets", async () => {
    await expectSaga(updateENFAlert, {
      type: "action",
      payload: [CONTACT2],
    })
      .provide([
        [select(selectLastEnfAlertDismissDate), DATE_BEFORE_CONTACT1],
        [select(selectENFAlert), undefined],
        [
          call(selectENFNotificationRiskBucket, CONTACT2.maxRiskScore),
          riskBucketSelector,
        ],
        [select(riskBucketSelector), enfConfig[2]],
      ])
      .put(setEnfAlert(RESULT_FROM_CONTACT2_BUCKET2))
      .silentRun();
  });

  it("should show no alert if contact risk score doesn't fin into a bucket", async () => {
    await expectSaga(updateENFAlert, {
      type: "action",
      payload: [CONTACT1],
    })
      .provide([
        [select(selectLastEnfAlertDismissDate), DATE_BEFORE_CONTACT1],
        [select(selectENFAlert), undefined],
        [
          call(selectENFNotificationRiskBucket, CONTACT1.maxRiskScore),
          riskBucketSelector,
        ],
        [select(riskBucketSelector), undefined],
      ])
      .put(setEnfAlert(undefined))
      .silentRun();
  });

  it("should show the alert with the most recent exposure date", async () => {
    await expectSaga(updateENFAlert, {
      type: "action",
      payload: [CONTACT3, CONTACT2, CONTACT1],
    })
      .provide([
        [select(selectLastEnfAlertDismissDate), DATE_AFTER_CONTACT1],
        [select(selectENFAlert), undefined],
        [
          call(selectENFNotificationRiskBucket, CONTACT2.maxRiskScore),
          riskBucketSelector,
        ],
        [select(riskBucketSelector), enfConfig[2]],
      ])
      .put(setEnfAlert(RESULT_FROM_CONTACT2_BUCKET2_1))
      .silentRun();
  });
});
