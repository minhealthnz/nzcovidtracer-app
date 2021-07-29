import { upsertMany, UpsertUser } from "@db/entities/user";
import { createLogger } from "@logger/createLogger";
import { logPerformance } from "@logger/logPerformance";
import { NativeModules, Platform } from "react-native";
import { SagaIterator } from "redux-saga";
import { call, put, select } from "redux-saga/effects";

import CovidTracerMigration, {
  MigrationData,
  UserData,
} from "../../../../lib/covidtracer_migration/src";
import { setUsersCopied } from "../reducer";
import { selectUsersCopied } from "../selectors";

const { logInfo, logWarning, logError } = createLogger("copyUsers");

const migration: CovidTracerMigration = NativeModules.CovidTracerMigration;

export function* copyUsers(): SagaIterator {
  logInfo("start");
  try {
    yield call(_copyUsers);
    yield put(setUsersCopied(true));
    logInfo("user copied, success");
  } catch (err) {
    yield put(setUsersCopied(false));
    logInfo("user copied, failure");
    logError(err);
  } finally {
    logPerformance("launch", "copy user");
  }
}

function* _copyUsers(): SagaIterator {
  if (Platform.OS === "ios" || migration.fetchData == null) {
    logInfo("ios, skipped");
    return;
  }

  const copied = yield select(selectUsersCopied);
  if (copied) {
    logInfo("already copied, skipped");
    return;
  }

  // Skip encyption on dev builds
  const skipEncryption = __DEV__;
  logInfo(`skipEncryption: ${skipEncryption ? "true" : "false"}`);

  const data: MigrationData = yield call(
    migration.fetchData,
    skipEncryption,
    true,
    false,
    false,
  );

  logInfo(`number of users: ${data.users?.length ?? 0}`);

  const users = (data.users ?? [])
    .map(mapUser)
    .filter((x) => x != null)
    .map((x) => x!);

  logInfo(`number of users, filtered: ${users.length}`);

  yield call(upsertMany, users);
}

function mapUser(user: UserData): UpsertUser | undefined {
  // TODO isActive is ignored
  const { id, nhi } = user;
  if (
    // User must have id
    id == null
  ) {
    logWarning(`filtered out ${JSON.stringify(user)}`);
    return undefined;
  }

  return {
    id,
    nhi,
  };
}
