import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import { check, PERMISSIONS } from "react-native-permissions";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  appDidBecomeAvailable,
  PermissionStatus,
  setCameraPermision,
} from "../reducer";

const { logError } = createLogger("device/checkCameraPermission");

export function* checkCameraPermission(): SagaIterator {
  yield takeLatest(appDidBecomeAvailable.type, onCheckCameraPermision);
}

function* onCheckCameraPermision(): SagaIterator {
  const CAMERA_PERMISSION =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  try {
    const permissionStatus: PermissionStatus = yield call(
      check,
      CAMERA_PERMISSION,
    );

    yield put(setCameraPermision(permissionStatus));
  } catch (error) {
    logError(error);
  }
}
