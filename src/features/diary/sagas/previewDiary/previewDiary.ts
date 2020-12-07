import { selectLegacyUsers } from "@domain/user/selectors";
import { User } from "@domain/user/types";
import { DiaryScreen } from "@features/diary/screens";
import { errors } from "@features/diary/types";
import { OnboardingScreen } from "@features/onboarding/screens";
import { OTPFulfilled, otpFulfilled, OTPSession } from "@features/otp/reducer";
import { selectOTPSessions } from "@features/otp/selectors";
import { createLogger } from "@logger/createLogger";
import { navigationRef } from "@navigation/navigation";
import { PayloadAction } from "@reduxjs/toolkit";
import { TabScreen } from "@views/screens";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  previewDiary as previewDiaryAction,
  previewDiaryFulfilled,
  previewDiaryRejected,
  updatePreviewDiary,
} from "../../reducer";

const { logError } = createLogger("saga/previewDiary");

export function* previewDiary(
  navigateViewDiary = _navigateViewDiary,
): SagaIterator {
  yield takeLatest(otpFulfilled, onPreviewDiary, navigateViewDiary);
}

function* onPreviewDiary(
  navigateViewDiary: (
    userId: string,
    email: string,
    isOnboarding: boolean,
  ) => void,
  { payload }: PayloadAction<OTPFulfilled>,
): SagaIterator {
  const sessionsById: { [id: string]: OTPSession } = yield select(
    selectOTPSessions,
  );
  const session = sessionsById[payload.sessionId];
  if (
    session == null ||
    (session.type !== "viewDiary" && session.type !== "viewDiaryOnboarding")
  ) {
    return;
  }

  yield put(previewDiaryAction());

  if (session.userId == null || session.email == null) {
    yield put(previewDiaryRejected({ code: errors.previewDiary.generic }));
    return;
  }

  const isOnboarding = session.type === "viewDiaryOnboarding";
  yield put(
    updatePreviewDiary({
      userId: session.userId,
      email: session.email,
      isOnboarding,
    }),
  );

  const legacyUsers: User[] = yield select(selectLegacyUsers);
  const legacyUser = legacyUsers.find((x) => x.id === session.userId);
  if (legacyUser == null) {
    yield put(previewDiaryRejected({ code: errors.previewDiary.userNotFound }));
    return;
  }

  try {
    yield call(navigateViewDiary, session.userId, session.email, isOnboarding);
  } catch (err) {
    logError(err);
    yield put(previewDiaryRejected({ code: errors.previewDiary.generic }));
    return;
  }

  yield put(previewDiaryFulfilled());
}

function _navigateViewDiary(
  userId: string,
  email: string,
  isOnboarding: boolean,
) {
  if (navigationRef.current == null) {
    throw new Error("Navigation ref cannot be null");
  }

  if (isOnboarding) {
    // Double navigate to remove the otp screens from stack
    navigationRef.current.navigate(OnboardingScreen.MultipleDiaries);
    navigationRef.current.navigate(DiaryScreen.ViewDiary, {
      userId,
      email,
      isOnboarding,
    });
  } else {
    // Double navigate to remove the otp screens from stack
    navigationRef.current.navigate(TabScreen.MyData);
    navigationRef.current.navigate(DiaryScreen.Navigator, {
      screen: DiaryScreen.ViewDiary,
      params: {
        userId,
        email,
        isOnboarding,
      },
    });
  }
}
