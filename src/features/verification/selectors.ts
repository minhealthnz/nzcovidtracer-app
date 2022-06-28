import { ReduxState } from "@domain/types";
import { isNil } from "lodash";
import { createSelector } from "reselect";

import { INITIAL_STATE } from "./reducer";

const { refreshToken: DEFAULT_REFRESH_TOKEN, token: DEFAULT_AUTH_TOKEN } =
  INITIAL_STATE;

const selectVerification = (state: ReduxState) => state.verification;

export const selectToken = createSelector(
  selectVerification,
  (verification) => verification.token,
);

export const selectRefreshToken = createSelector(
  selectVerification,
  (verification) => verification.refreshToken,
);

export const selectIsVerified = createSelector(
  selectVerification,
  (verification) => {
    return !!verification.refreshToken && !!verification.token;
  },
);

export const selectIsReady = createSelector(
  selectVerification,
  selectToken,
  selectRefreshToken,
  (verification, authToken, refreshToken) =>
    !isNil(authToken) &&
    !isNil(refreshToken) &&
    authToken !== DEFAULT_AUTH_TOKEN &&
    refreshToken !== DEFAULT_REFRESH_TOKEN &&
    verification.enabled,
);

export const selectVerificationCredentials = createSelector(
  selectToken,
  selectRefreshToken,
  (authToken, refreshToken) => ({ authToken, refreshToken }),
);

export const selectEnfEnableNotificationSent = createSelector(
  selectVerification,
  (verification) => verification.enfEnableNotificationSent,
);

export const selectIsRetriable = createSelector(
  selectVerification,
  (verification) => verification.retriable,
);

export const selectIsEnfEnabled = createSelector(
  selectVerification,
  (verification) => verification.enabled,
);
