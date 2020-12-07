import { ReduxState } from "@domain/types";
import { User } from "@domain/user/types";
import { _storeRef } from "@lib/storeRefs";
import { nanoid } from "@reduxjs/toolkit";

import config from "../../config";
import { createLogger } from "../../logger/createLogger";
import { ERROR_MFA_ENABLED } from "./errors";

const { logInfo } = createLogger("otp/injection");

export function injectMfaErrorIfNeeded() {
  if (!config.IsDev) {
    return;
  }
  const store = _storeRef.current;
  if (store == null) {
    return;
  }
  const state = store.getState() as ReduxState;
  if (!state.debugging.injectedMfaError) {
    return;
  }
  logInfo("inject mfa error");
  const users = state.user.byId;
  const legacyUser: User | undefined = Object.values(users).filter(
    (x) => !x.isAnonymous,
  )[0];
  throw {
    response: {
      data: {
        type: ERROR_MFA_ENABLED,
        userId: legacyUser?.id ?? nanoid(),
      },
    },
  };
}
