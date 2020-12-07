import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OTPState {
  byId: { [id: string]: OTPSession };
}

export interface OTPSession {
  createdAt: number;
  type: string;
  mfaErrorHandling: "ignore" | "prompt";
  email?: string;
  verificationId?: string;
  fulfilled: boolean;
  verifyEmailScreenTitle?: string;
  enterEmailScreenTitle?: string;
  userId?: string;
  accessToken?: string;
}

const initialState: OTPState = {
  byId: {},
};

export interface CreateOTPSession {
  id: string;
  type: string;
  /**
   * How to handle MFA errors. for users with MFA enabled, otp verify api will return an error response, with an userId.
   * Depending on the configuration, the session will either resolve successfully, with the userId (ignore),
   * or prompt for the user to disable MFA, and reject the otp attempt (prompt)
   */
  mfaErrorHandling: "ignore" | "prompt";
  email?: string;
  verificationId?: string;
  verifyEmailScreenTitle?: string;
  enterEmailScreenTitle?: string;
}

export interface UpdateSession {
  id: string;
  email?: string;
  verificationId?: string;
  userId?: string;
}

export interface OTPFulfilled {
  sessionId: string;
  /**
   * This is not used currently, but can be used to reuse otp sessions in the future
   */
  accessToken?: string;
}

const slice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    createOTPSession(state, { payload }: PayloadAction<CreateOTPSession>) {
      state.byId[payload.id] = {
        createdAt: new Date().getTime(),
        type: payload.type,
        mfaErrorHandling: payload.mfaErrorHandling,
        email: payload.email,
        verificationId: payload.verificationId,
        verifyEmailScreenTitle: payload.verifyEmailScreenTitle,
        enterEmailScreenTitle: payload.enterEmailScreenTitle,
        fulfilled: false,
      };
    },
    updateSession(state, { payload }: PayloadAction<UpdateSession>) {
      const session = state.byId[payload.id];
      if (session == null) {
        return;
      }
      if (payload.email !== undefined) {
        session.email = payload.email;
      }
      if (payload.verificationId !== undefined) {
        session.verificationId = payload.verificationId;
      }
      if (payload.userId !== undefined) {
        session.userId = payload.userId;
      }
    },
    otpFulfilled(state, { payload }: PayloadAction<OTPFulfilled>) {
      const session = state.byId[payload.sessionId];
      if (session == null) {
        return;
      }
      session.fulfilled = true;
      if (payload.accessToken != null) {
        session.accessToken = payload.accessToken;
      }
    },
  },
});

const { reducer, actions } = slice;

export const { createOTPSession, updateSession, otpFulfilled } = actions;

export default reducer;
