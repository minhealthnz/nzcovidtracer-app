import {
  AddCheckInItem,
  addCheckIns,
  CheckInItemType,
} from "@db/entities/checkInItem";
import { setSessionType } from "@features/onboarding/reducer";
import { createLogger } from "@logger/createLogger";
import moment from "moment-timezone";
import { NativeModules, Platform } from "react-native";
import { SagaIterator } from "redux-saga";
import { call, put, select, take } from "redux-saga/effects";

import CovidTracerMigration, {
  DiaryEntryData,
  MigrationData,
} from "../../../../lib/covidtracer_migration/src";
import { setCheckInsCopied } from "../reducer";
import { selectCheckInsCopied } from "../selectors";

const { logError, logWarning, logInfo } = createLogger("copyCheckIn");

const migration: CovidTracerMigration = NativeModules.CovidTracerMigration;

export function* copyCheckIns(): SagaIterator {
  yield take(setSessionType);
  try {
    yield call(_copyCheckIns);
    yield put(setCheckInsCopied(true));
  } catch (err) {
    yield put(setCheckInsCopied(false));
    logError(err);
  }
}

function* _copyCheckIns(): SagaIterator {
  if (Platform.OS === "ios" || migration.fetchData == null) {
    return;
  }

  const copied = yield select(selectCheckInsCopied);
  if (copied) {
    return;
  }

  const skipEncryption = __DEV__;

  const data: MigrationData = yield call(
    migration.fetchData,
    skipEncryption,
    false,
    true,
    false,
  );

  const entries = (data.diaryEntries ?? [])
    .map(mapCheckInItem)
    .filter((x) => x != null)
    .map((x) => x!);

  yield call(addCheckIns, entries);

  logInfo("Check-ins copied");
}

export function mapCheckInItem(
  item: DiaryEntryData,
): AddCheckInItem | undefined {
  const {
    id,
    userId,
    startDate,
    endDate,
    name,
    address,
    gln,
    note,
    type,
  } = item;

  if (
    // Diary entry must have id
    id == null ||
    // Diary entry must have userId
    // TODO Review handling iOS v1 scans where userId is undefined
    userId == null ||
    // Diary entry must have type
    type == null ||
    // Diary entry must have start date
    startDate == null
  ) {
    logWarning(`filtered out ${JSON.stringify(item)}`);
    return undefined;
  }

  const mappedStartDate = moment(startDate);
  if (!mappedStartDate.isValid()) {
    logWarning(`filtered out ${JSON.stringify(item)}`);
    return undefined;
  }

  const mappedEndDate = endDate == null ? undefined : moment(endDate);
  if (mappedEndDate != null && !mappedEndDate.isValid()) {
    logWarning(`filtered out ${JSON.stringify(item)}`);
    return undefined;
  }

  const mappedType = mapType(type);
  if (mappedType == null) {
    logWarning(`filtered out ${JSON.stringify(item)}`);
    return undefined;
  }

  return {
    id,
    userId,
    startDate: mappedStartDate.toDate(),
    endDate: mappedEndDate == null ? mappedEndDate : mappedEndDate.toDate(),
    name: name ?? "",
    address: address ?? "",
    globalLocationNumber: gln ?? "",
    note,
    type: mappedType,
  };
}

export function mapType(type: number): CheckInItemType | undefined {
  switch (type) {
    case 0:
      return CheckInItemType.Scan;
    case 1:
      return CheckInItemType.Manual;
    case 2:
      return CheckInItemType.NFC;
    default:
      return undefined;
  }
}
