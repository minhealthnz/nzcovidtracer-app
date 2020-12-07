import { selectPreviewDiary } from "@features/diary/selectors";
import { errors } from "@features/diary/types";
import { OnboardingScreen } from "@features/onboarding/screens";
import { navigationRef } from "@navigation/navigation";
import { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { TabScreen } from "@views/screens";
import { Alert } from "react-native";
import { SagaIterator } from "redux-saga";
import { call, select, takeLatest } from "redux-saga/effects";

import strings from "../../../../translations/strings";
import { previewDiaryRejected } from "../../reducer";

export function* handleError(): SagaIterator {
  yield takeLatest(previewDiaryRejected, onHandleError);
}

function* onHandleError({
  payload,
}: PayloadAction<SerializedError>): SagaIterator {
  const previewDiaryRequest = yield select(selectPreviewDiary);
  const [title, message] = getAlert(payload);
  yield call(
    Alert.alert,
    title,
    message,
    [
      {
        text: "OK",
        onPress: () => {
          if (previewDiaryRequest.isOnboarding) {
            navigationRef.current?.navigate(OnboardingScreen.MultipleDiaries);
          } else {
            navigationRef.current?.navigate(TabScreen.MyData);
          }
        },
      },
    ],
    { cancelable: false },
  );
}

function getAlert(error: SerializedError) {
  switch (error.code) {
    case errors.previewDiary.userNotFound:
      return [
        strings.en.screens.viewDiary.userNotFound.title,
        strings.en.screens.viewDiary.userNotFound.message,
      ];
    case errors.previewDiary.generic:
    default:
      return [strings.en.errors.error, strings.en.errors.generic];
  }
}
