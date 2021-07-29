import { update as updateUser } from "@db/entities/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, UserState } from "./types";

const INITIAL_STATE: UserState = {
  byId: {},
  setAlias: {
    pending: false,
  },
  setNHI: {
    pending: false,
    fulfilled: false,
  },
};

export interface SetAlias {
  userId: string;
  alias: string;
}

export interface UpdateDetails {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const updateDetails = createAsyncThunk(
  "user/updateDetails",
  async (payload: UpdateDetails) => {
    await updateUser(payload.userId, (updated) => {
      updated.firstName = payload.firstName;
      updated.lastName = payload.lastName;
      updated.email = payload.email;
      updated.phone = payload.phone;
    });
    return payload;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setLegacyUsers(state, { payload }: PayloadAction<User[]>) {
      for (const user of payload) {
        state.byId[user.id] = user;
      }
    },
    setAnonymousUser(state, { payload }: PayloadAction<User>) {
      state.byId[payload.id] = payload;
      state.anonymousUserId = payload.id;
    },
    setAlias(state, _action: PayloadAction<SetAlias>) {
      state.setAlias.pending = true;
      state.setAlias.error = undefined;
    },
    setAliasFulfilled(state, { payload }: PayloadAction<SetAlias>) {
      state.setAlias.pending = false;
      const { userId, alias } = payload;
      if (state.byId[userId] != null) {
        state.byId[userId].alias = alias;
      }
    },
    setAliasRejected(state, { payload }: PayloadAction<Error>) {
      state.setAlias.pending = false;
      state.setAlias.error = payload;
    },
    setNHI(state, _action: PayloadAction<string>) {
      state.setNHI.pending = true;
      state.setNHI.fulfilled = false;
      state.setNHI.error = undefined;
    },
    setNHIFulfilled(state, { payload }: PayloadAction<string>) {
      state.setNHI.pending = false;
      state.setNHI.fulfilled = true;
      if (state.anonymousUserId != null) {
        state.byId[state.anonymousUserId].nhi = payload;
      }
    },
    setNHIRejected(state, { payload }: PayloadAction<Error>) {
      state.setNHI.pending = false;
      state.setNHI.fulfilled = false;
      state.setNHI.error = payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(updateDetails.fulfilled, (state, { payload }) => {
      if (
        state.anonymousUserId == null ||
        state.byId[state.anonymousUserId] == null
      ) {
        return;
      }
      const user = state.byId[state.anonymousUserId];
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.email = payload.email;
      user.phone = payload.phone;
    }),
});

const { reducer, actions } = userSlice;

export const {
  setLegacyUsers,
  setAnonymousUser,
  setAlias,
  setAliasFulfilled,
  setAliasRejected,
  setNHI,
  setNHIFulfilled,
  setNHIRejected,
} = actions;

export default reducer;
