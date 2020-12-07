import { setLegacyUsers } from "@domain/user/reducer";
import { selectLegacyUsers } from "@domain/user/selectors";
import { createLogger } from "@logger/createLogger";
import { logPerformance } from "@logger/logPerformance";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { SagaIterator } from "redux-saga";
import { all, call, delay, put, race, select, take } from "redux-saga/effects";

import { setEnfSupported, setSessionType } from "./reducer";
import { selectSessionType } from "./selectors";
import { SessionType } from "./types";

const { logError } = createLogger("saga/onboarding");

function* checkAndSetSessionType(): SagaIterator {
  const legacyUsers = yield select(selectLegacyUsers);
  switch (legacyUsers.length) {
    case 0:
      yield put(setSessionType("new"));
      break;
    case 1:
      yield put(setSessionType("single"));
      break;
    default:
      yield put(setSessionType("multi"));
  }
}

const MAX_WAIT_TIME_FOR_COPY_USERS = 20000;

function* copyUsersFallbackTimeout(): SagaIterator {
  yield delay(MAX_WAIT_TIME_FOR_COPY_USERS);
  yield call(
    logError,
    "Copying users took too long, aborting and setting session type as new",
  );
}

function* loadEnfSupported(): SagaIterator {
  const enfSupported: boolean = yield call(
    ExposureNotificationModule.isSupported,
  );
  yield put(setEnfSupported(enfSupported));
}

function* onboarding(): SagaIterator {
  const sessionType: SessionType = yield select(selectSessionType);

  if (sessionType === "unknown") {
    yield race({
      usersCopied: take(setLegacyUsers.type),
      timedOut: call(copyUsersFallbackTimeout),
    });
    yield call(checkAndSetSessionType);
    logPerformance("launch", "init session type");
  } else {
    yield put(setSessionType(sessionType));
    logPerformance("launch", "restore session type");
  }
}

export default function* sagaWatcher(): SagaIterator {
  yield all([call(onboarding), call(loadEnfSupported)]);
}
