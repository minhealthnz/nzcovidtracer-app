import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  PermissionStatus,
  requestCameraPermission as requestCameraPermissionAction,
  setCameraPermision,
  setHasRequestedCameraPermission,
} from "../reducer";

const { logError } = createLogger("device/requestCameraPermission");

export function* requestCameraPermission(): SagaIterator {
  yield takeLatest(
    requestCameraPermissionAction.type,
    onRequestCameraPermission,
  );
}

function* onRequestCameraPermission(): SagaIterator {
  const CAMERA_PERMISSION =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  try {
    const result: PermissionStatus = yield call(request, CAMERA_PERMISSION);
    yield put(setHasRequestedCameraPermission());
    yield put(setCameraPermision(result));
  } catch (error) {
    logError(error);
  }
}
