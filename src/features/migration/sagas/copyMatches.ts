import {
  UpsertCheckInItemMatch,
  upsertMany,
} from "@db/entities/checkInItemMatch";
import { setSessionType } from "@features/onboarding/reducer";
import { createLogger } from "@logger/createLogger";
import moment from "moment";
import { NativeModules, Platform } from "react-native";
import { SagaIterator } from "redux-saga";
import { call, put, select, take } from "redux-saga/effects";

import CovidTracerMigration, {
  MatchData,
  MigrationData,
} from "../../../../lib/covidtracer_migration/src";
import { setMatchesCopied } from "../reducer";
import { selectMatchesCopied } from "../selectors";

const { logError, logWarning, logInfo } = createLogger("copyMatches");

const migration: CovidTracerMigration = NativeModules.CovidTracerMigration;

export function* copyMatches(): SagaIterator {
  yield take(setSessionType);
  try {
    yield call(_copyMatches);
    yield put(setMatchesCopied(true));
  } catch (err) {
    yield put(setMatchesCopied(false));
    logError(err);
  }
}

function* _copyMatches() {
  if (Platform.OS === "ios" || migration.fetchData == null) {
    return;
  }

  const copied = yield select(selectMatchesCopied);
  if (copied) {
    return;
  }

  const skipEncryption = __DEV__;

  const data: MigrationData = yield call(
    migration.fetchData,
    skipEncryption,
    false,
    false,
    true,
  );

  const matches = (data.matches ?? [])
    .map(mapMatch)
    .filter((x) => x != null)
    .map((x) => x!);

  yield call(upsertMany, matches);
  logInfo("Matches copied");
}

export function mapMatch(match: MatchData): UpsertCheckInItemMatch | undefined {
  const {
    id,
    notificationId,
    eventId,
    startDate,
    endDate,
    systemNotificationBody,
    appBannerTitle,
    appBannerBody,
    appBannerLinkLabel,
    appBannerLinkUrl,
    appBannerRequestCallbackEnabled,
    callbackRequested,
    ack,
  } = match;

  if (
    // Matches must have id
    id == null ||
    // Matches must have start date
    startDate == null ||
    // Matches must have end date
    endDate == null ||
    // Matches must have event id
    eventId == null ||
    // Matches must have notification id
    notificationId == null
  ) {
    logWarning(`filtered out ${JSON.stringify(match)}`);
    return undefined;
  }

  const mappedStartDate = moment(startDate);
  const mappedEndDate = moment(endDate);

  if (!mappedStartDate.isValid) {
    logWarning(`filtered out ${JSON.stringify(match)}`);
    return undefined;
  }

  if (!mappedEndDate.isValid) {
    logWarning(`filtered out ${JSON.stringify(match)}`);
    return undefined;
  }

  return {
    id,
    notificationId,
    eventId,
    startDate: mappedStartDate.toDate(),
    endDate: mappedEndDate.toDate(),
    // Not used
    globalLocationNumberHash: "",
    systemNotificationBody,
    appBannerTitle,
    appBannerBody,
    appBannerLinkLabel,
    appBannerLinkUrl,
    appBannerRequestCallbackEnabled: appBannerRequestCallbackEnabled ?? false,
    callbackRequested: callbackRequested ?? false,
    acknowledged: ack ?? false,
  };
}
