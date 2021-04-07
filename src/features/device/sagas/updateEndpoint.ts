import { createLogger } from "@logger/createLogger";
import DeviceInfo from "react-native-device-info";
import { call, take } from "redux-saga/effects";

import { appDidBecomeAvailable } from "../reducer";

const { logError } = createLogger("sagas/device/updateEndpoint");

export function* updateEndpoint() {
  yield take(appDidBecomeAvailable);
  try {
    yield call(_updateEndpoint);
  } catch (err) {
    logError("Error updating endpoint", err);
  }
}

async function _updateEndpoint() {
  const buildNumber = DeviceInfo.getBuildNumber();

  const { Analytics } = require("aws-amplify");

  await Analytics.updateEndpoint({
    attributes: {
      buildNumber: [buildNumber],
      inlineRequires: ["true"],
    },
  });
}
