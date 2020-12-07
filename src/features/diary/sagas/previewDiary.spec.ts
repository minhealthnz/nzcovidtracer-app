import { selectLegacyUsers } from "@domain/user/selectors";
import { User } from "@domain/user/types";
import { otpFulfilled, OTPSession } from "@features/otp/reducer";
import { selectOTPSessions } from "@features/otp/selectors";
import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";
import { select } from "redux-saga-test-plan/matchers";

import {
  previewDiary as previewDiaryAction,
  previewDiaryFulfilled,
  previewDiaryRejected,
  updatePreviewDiary,
} from "../reducer";
import { previewDiary } from "./previewDiary/previewDiary";

describe("#previewDiary", () => {
  it("previews successfully", async () => {
    const { saga, session } = setupSaga();
    await saga
      .put(previewDiaryAction())
      .put(
        updatePreviewDiary({
          userId: session.userId,
          email: session.email,
          isOnboarding: false,
        }),
      )
      .put(previewDiaryFulfilled())
      .silentRun();
  });
  it("previews successfully for onboarding", async () => {
    const { saga, session } = setupSaga({
      otpSessiontype: "viewDiaryOnboarding",
    });
    await saga
      .put(previewDiaryAction())
      .put(
        updatePreviewDiary({
          userId: session.userId,
          email: session.email,
          isOnboarding: true,
        }),
      )
      .put(previewDiaryFulfilled())
      .silentRun();
  });
  it("skips if session not found", async () => {
    const { saga } = setupSaga({ sessionNotFound: true });
    await saga.not.put
      .actionType(previewDiaryAction.type)
      .not.put.actionType(updatePreviewDiary.type)
      .not.put.actionType(previewDiaryFulfilled.type)
      .silentRun();
  });
  it("skips if session type does not match", async () => {
    const { saga } = setupSaga({ otpSessiontype: "foo" });
    await saga.not.put
      .actionType(previewDiaryAction.type)
      .not.put.actionType(updatePreviewDiary.type)
      .not.put.actionType(previewDiaryFulfilled.type)
      .silentRun();
  });
  it("puts error if session does not have userId", async () => {
    const { saga } = setupSaga({ noUserId: true });
    await saga.put.actionType(previewDiaryRejected.type).silentRun();
  });
  it("puts error if session does not have email", async () => {
    const { saga } = setupSaga({ noEmail: true });
    await saga.put.actionType(previewDiaryRejected.type).silentRun();
  });
  it("puts error if userId does not match any existing legacy users", async () => {
    const { saga } = setupSaga({ noMatch: true });
    await saga.put.actionType(previewDiaryRejected.type).silentRun();
  });
  it("puts error if navigateViewDiary fails", async () => {
    const { saga } = setupSaga({ navigateFail: true });
    await saga.put.actionType(previewDiaryRejected.type).silentRun();
  });
});

interface SagaOptions {
  sessionNotFound?: boolean;
  otpSessiontype?: string;
  noUserId?: boolean;
  noEmail?: boolean;
  noMatch?: boolean;
  navigateFail?: boolean;
}

function setupSaga(options?: SagaOptions) {
  const sessionId = nanoid();
  const accessToken = nanoid();
  const session: OTPSession = {
    createdAt: new Date().getTime(),
    fulfilled: false,
    mfaErrorHandling: "ignore",
    type: options?.otpSessiontype ?? "viewDiary",
    userId: options?.noUserId ? undefined : nanoid(),
    email: options?.noEmail ? undefined : `${nanoid()}@gmail.com`,
    accessToken,
  };
  const sessions: { [id: string]: OTPSession } = {
    [sessionId]: session,
  };
  if (options?.sessionNotFound) {
    delete sessions[sessionId];
  }
  const legacyUsers: User[] = [
    {
      id: session.userId!,
    },
  ];
  if (options?.noMatch) {
    legacyUsers.length = 0;
  }
  const navigateViewDiary = () => {
    if (options?.navigateFail) {
      throw new Error("foo");
    }
  };
  const saga = expectSaga(previewDiary, navigateViewDiary)
    .provide([
      [select(selectOTPSessions), sessions],
      [select(selectLegacyUsers), legacyUsers],
    ])
    .dispatch(
      otpFulfilled({
        sessionId,
        accessToken,
      }),
    );
  return {
    saga,
    sessionId,
    session,
  };
}
