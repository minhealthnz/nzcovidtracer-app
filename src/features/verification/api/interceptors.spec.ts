import { nanoid } from "@reduxjs/toolkit";
import { AxiosRequestConfig } from "axios";

import {
  refreshTokenIfNeeded,
  refreshTokenWhenUnauthorized,
} from "./interceptors";
import { TokenStore } from "./types";

interface StoreOption {
  shouldRefreshToken?: boolean;
}

const mockStore = (option?: StoreOption) => {
  const shouldRefreshToken = option?.shouldRefreshToken ?? false;
  const store: TokenStore = {
    getToken: jest.fn().mockReturnValue(nanoid()),
    getRefreshToken: jest.fn().mockReturnValue(nanoid()),
    setToken: jest.fn(),
    shouldRefreshToken: jest.fn().mockReturnValue(shouldRefreshToken),
  };
  return store;
};

describe("#interceptors", () => {
  it("refresh token if needed", async () => {
    const config: AxiosRequestConfig = { headers: {} };
    const store = mockStore({
      shouldRefreshToken: true,
    });
    const token = nanoid();
    const postRefreshToken = jest.fn().mockReturnValue({ data: { token } });
    await refreshTokenIfNeeded(config, {
      store,
      postRefreshToken,
    });
    expect(config.headers.Authorization).toEqual(`Bearer ${token}`);
    expect(store.setToken).toBeCalledWith(token);
  });
  it("skips refresh token if not needed", async () => {
    const config: AxiosRequestConfig = { headers: {} };
    const store = mockStore();
    const token = nanoid();
    const postRefreshToken = jest.fn().mockReturnValue({ data: { token } });
    await refreshTokenIfNeeded(config, { store, postRefreshToken });
    expect(store.setToken).not.toBeCalled();
  });
  it("refresh token when unauthorized", async () => {
    const store = mockStore();
    const token = nanoid();
    const postRefreshToken = jest.fn().mockReturnValue({ data: { token } });
    const cloneRequest = jest.fn().mockReturnValue(nanoid());
    const err = {
      response: {
        status: 401,
      },
      config: {
        headers: {
          Authorization: "",
        },
      },
    };
    const result = await refreshTokenWhenUnauthorized(err, {
      store,
      postRefreshToken,
      cloneRequest,
    });
    expect(store.setToken).toBeCalled();
    expect(result).toBeTruthy();
    expect(err.config.headers.Authorization).toEqual(`Bearer ${token}`);
  });
});
