import { createSlice } from "@reduxjs/toolkit";

export interface DebuggingState {
  injectedMfaError: boolean;
}

const INITIAL_STATE = {
  injectedMfaError: false,
};

const slice = createSlice({
  name: "debugging",
  initialState: INITIAL_STATE,
  reducers: {
    injectMfaError(state) {
      state.injectedMfaError = true;
    },
  },
});

const { reducer, actions } = slice;

export const { injectMfaError } = actions;

export default reducer;
