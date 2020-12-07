import { appDidBecomeAvailable } from "@domain/device/reducer";
import { selectIsEnfSupported } from "@features/enf/selectors";
import { setEnfSupported } from "@features/onboarding/reducer";
import {
  selectDeviceRegistered,
  selectHasSeenEnf,
} from "@features/onboarding/selectors";
import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import {
  registerDeviceFulfilled,
  registerDeviceRejected,
  registerDeviceSkipped,
} from "../commonActions";
import { setEnfEnableNotificationSent } from "../reducer";
import {
  selectEnfEnableNotificationSent,
  selectRefreshToken,
  selectToken,
} from "../selectors";
import { notifyRegisterDeviceRetrySuccess } from "../service/notifyRegisterDeviceRetrySuccess";
import { verifyDevice as _verifyDevice } from "../verifyDevice";

const { logInfo, logError } = createLogger("registerDevice");

export function* registerDevice(verifyDevice = _verifyDevice): SagaIterator {
  yield takeLeading(
    [appDidBecomeAvailable, setEnfSupported],
    onRegisterDevice,
    verifyDevice,
  );
}

function* onRegisterDevice(
  verifyDevice: () => Promise<{ token: string; refreshToken: string }>,
) {
  try {
    const isSupported: ReturnType<typeof selectIsEnfSupported.resultFunc> = yield select(
      selectIsEnfSupported,
    );
    if (isSupported === undefined) {
      logInfo("still loading is supported, skipped");
      return;
    }
    if (!isSupported) {
      yield put(registerDeviceSkipped());
      logInfo("register device skipped, not supported");
      return;
    }
    const refreshToken = yield select(selectRefreshToken);
    if (refreshToken) {
      const token = yield select(selectToken);
      yield put(
        registerDeviceFulfilled({
          refreshToken,
          token,
        }),
      );
      logInfo("register device fulfilled, already registered");
      return;
    }
    const tokens: { token: string; refreshToken: string } = yield call(
      verifyDevice,
    );

    const previousDeviceRegisteredState = yield select(selectDeviceRegistered);

    yield put(registerDeviceFulfilled(tokens));
    logInfo("register device successful");
    recordAnalyticEvent(AnalyticsEvent.ENFDeviceRegisterSuccess);

    const hasSeenEnf = yield select(selectHasSeenEnf);
    const enfEnableNotificationSent = yield select(
      selectEnfEnableNotificationSent,
    );
    const notifyEnfOnSuccess =
      previousDeviceRegisteredState === "failure" &&
      !hasSeenEnf &&
      !enfEnableNotificationSent;

    if (notifyEnfOnSuccess) {
      yield call(notifyRegisterDeviceRetrySuccess);
      yield put(setEnfEnableNotificationSent());
      logInfo("retry device successful - ENF notifiy success");
    }
  } catch (err) {
    yield put(
      registerDeviceRejected({
        isNetworkError: isNetworkError(err),
      }),
    );
    logError("register device failed", err);
    recordAnalyticEvent(AnalyticsEvent.ENFDeviceRegisterFailure);
  }
}
