import {
  _reducer as reducer,
  MigrationState,
  setCheckInsCopied,
  setMatchesCopied,
  setUsersCopied,
} from "./reducer";

function buildState(): MigrationState {
  return {
    usersCopied: false,
    checkInsCopied: false,
    matchesCopied: false,
  };
}

it("#setUsersCopied sets users copied", () => {
  const state = buildState();
  const next = reducer(state, setUsersCopied(true));
  expect(next.usersCopied).toBe(true);
});

it("#setCheckInsCopied sets checkins copied", () => {
  const state = buildState();
  const next = reducer(state, setCheckInsCopied(true));
  expect(next.checkInsCopied).toBe(true);
});

it("#setMatchesCopied sets matches copied", () => {
  const state = buildState();
  const next = reducer(state, setMatchesCopied(true));
  expect(next.matchesCopied).toBe(true);
});
