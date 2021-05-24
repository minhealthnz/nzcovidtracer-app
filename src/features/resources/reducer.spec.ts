import { nanoid } from "@reduxjs/toolkit";

import { _reducer as reducer, getData, ResourcesState } from "./reducer";

const buildInitialState = (
  partial?: Partial<ResourcesState>,
): ResourcesState => {
  return { ...partial };
};

describe("#getData.fulfilled", () => {
  it("updates data, expiry, etag and clears error", () => {
    const state = buildInitialState({
      error: "unknown",
    });
    const data = {
      sections: [],
    };
    const expires = new Date();
    const etag = nanoid();
    const next = reducer(
      state,
      getData.fulfilled(
        {
          notModified: false,
          data,
          expires,
          etag,
        },
        nanoid(),
      ),
    );
    expect(next.data).toEqual(data);
    expect(next.expires).toEqual(expires.valueOf());
    expect(next.etag).toEqual(etag);
    expect(next.error).toBe(undefined);
  });
  it("clears error when not modified", () => {
    const state = buildInitialState({
      error: "network",
    });
    const next = reducer(
      state,
      getData.fulfilled(
        {
          notModified: true,
        },
        nanoid(),
      ),
    );
    expect(next.error).toBe(undefined);
  });
});

describe("#getData.rejected", () => {
  it("writes network error", () => {
    const state = buildInitialState();
    const next = reducer(
      state,
      getData.rejected(
        {
          code: "network",
        } as any,
        nanoid(),
      ),
    );
    expect(next.error).toBe("network");
  });
  it("writes unknown error", () => {
    const state = buildInitialState();
    const next = reducer(
      state,
      getData.rejected(new Error("unknown error"), nanoid()),
    );
    expect(next.error).toBe("unknown");
  });
});
