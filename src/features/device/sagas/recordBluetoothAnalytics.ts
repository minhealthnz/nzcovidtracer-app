import { setEnfStatus } from "@features/enf/reducer";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import { createLogger } from "@logger/createLogger";
import { Analytics } from "aws-amplify";
import { SagaIterator } from "redux-saga";
import { call, select, takeLatest } from "redux-saga/effects";

const { logError } = createLogger("sagas/recordBluetoothAnalytics");

export function* recordBluetoothAnalytics(): SagaIterator {
  yield takeLatest(setEnfStatus, onRecordBluetoothAnalytics);
}

function* onRecordBluetoothAnalytics(): SagaIterator {
  try {
    const bluetoothDisabled = yield select(selectBluetoothEnfDisabled);
    yield call(Analytics.updateEndpoint, {
      attributes: {
        bluetoothDisabled: [bluetoothDisabled],
      },
    });
  } catch (err) {
    logError(err);
  }
}
