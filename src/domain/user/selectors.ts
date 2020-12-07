import { ReduxState } from "@domain/types";
import { createSelector } from "@reduxjs/toolkit";

const _selectUser = (state: ReduxState) => state.user;

export const selectUserId = createSelector(
  _selectUser,
  (user) => user.anonymousUserId,
);

export const selectSetAliasError = createSelector(
  _selectUser,
  (user) => user.setAlias.error,
);

export const selectSetAliasPending = createSelector(
  _selectUser,
  (user) => user.setAlias.pending,
);

export const selectSetNHIPending = createSelector(
  _selectUser,
  (user) => user.setNHI.pending,
);

export const selectSetNHIFulfilled = createSelector(
  _selectUser,
  (user) => user.setNHI.fulfilled,
);

export const selectSetNHIError = createSelector(
  _selectUser,
  (user) => user.setNHI.error,
);

export const selectUser = createSelector(_selectUser, (user) =>
  user.anonymousUserId == null ? undefined : user.byId[user.anonymousUserId],
);

export const selectLegacyUsers = createSelector(_selectUser, (user) =>
  Object.values(user.byId).filter((x) => !x.isAnonymous),
);
