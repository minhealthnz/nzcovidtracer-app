import { nanoid } from "@reduxjs/toolkit";

import reducer, {
  setAlias,
  setAliasFulfilled,
  setAliasRejected,
  setNHI,
  setNHIFulfilled,
  setNHIRejected,
} from "./reducer";
import { UserState } from "./types";

function buildInitialState(
  anonymousUserId: string,
  ...legacyUserIds: string[]
): UserState {
  const state: UserState = {
    byId: {},
    setAlias: {
      pending: false,
    },
    setNHI: {
      pending: false,
      fulfilled: false,
    },
  };

  [anonymousUserId, ...legacyUserIds].forEach((userId, index) => {
    state.byId[userId] = {
      id: userId,
      isAnonymous: index === 0,
    };
    state.anonymousUserId = userId;
  });

  return state;
}

it("#setNHI sets pending", () => {
  const userId = nanoid();
  const initialState = buildInitialState(userId);
  const nhi = "abc";
  const next = reducer(initialState, setNHI(nhi));
  expect(next.setNHI.pending).toBe(true);
});

it("#setNHIFulfilled updates nhi", () => {
  const userId = nanoid();
  const initialState = buildInitialState(userId);
  const nhi = "abc";
  const next = reducer(initialState, setNHIFulfilled(nhi));
  expect(next.setNHI.pending).toBe(false);
  expect(next.byId[next.anonymousUserId!].nhi).toBe(nhi);
});

it("#setNHIRejected updates error", () => {
  const userId = nanoid();
  const initialState = buildInitialState(userId);
  const error = new Error("foo");
  const next = reducer(initialState, setNHIRejected(error));
  expect(next.setNHI.pending).toBe(false);
  expect(next.setNHI.error).toEqual(error);
});

it("#setAlias sets pending", () => {
  const userId = nanoid();
  const legacyUserId = nanoid();
  const initialState = buildInitialState(userId, legacyUserId);
  const payload = {
    userId: legacyUserId,
    alias: userId,
  };
  const next = reducer(initialState, setAlias(payload));
  expect(next.setAlias.pending).toBe(true);
});

it("#setAliasFulfilled updates alias", () => {
  const userId = nanoid();
  const legacyUserId = nanoid();
  const initialState = buildInitialState(userId, legacyUserId);
  const payload = {
    userId: legacyUserId,
    alias: userId,
  };
  const next = reducer(initialState, setAliasFulfilled(payload));
  expect(next.setAlias.pending).toBe(false);
  expect(next.byId[legacyUserId].alias).toBe(userId);
});

it("#setAliasRejected updates error", () => {
  const userId = nanoid();
  const initialState = buildInitialState(userId);
  const error = new Error("foo");
  const next = reducer(initialState, setAliasRejected(error));
  expect(next.setAlias.pending).toBe(false);
  expect(next.setAlias.error).toEqual(error);
});
