import { createLogger } from "@logger/createLogger";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { postRefreshToken as apiPostRefreshToken } from "./postRefreshToken";
import { ReduxTokenStore } from "./ReduxTokenStore";
import { TokenStore } from "./types";

const { logInfo } = createLogger("verification/api/interceptors");

const defaultStore = new ReduxTokenStore();

export interface InterceptorOptions {
  store: TokenStore;
  postRefreshToken(): Promise<AxiosResponse<{ token: string }>>;
  cloneRequest(): Promise<any>;
}

export const refreshTokenIfNeeded = async (
  config: AxiosRequestConfig,
  options?: Partial<InterceptorOptions>,
) => {
  logInfo("refresh token if needed...");
  const token = await retrieveToken(options);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const refreshTokenWhenUnauthorized = async (
  error: any,
  options?: Partial<InterceptorOptions>,
) => {
  logInfo("refresh token on 401...");
  const store = options?.store ?? defaultStore;
  const postRefreshToken = options?.postRefreshToken ?? apiPostRefreshToken;
  const cloneRequest = options?.cloneRequest ?? Axios.request;

  const status = error.response?.status;

  if (status === 401) {
    const refreshToken = store.getRefreshToken();
    if (refreshToken) {
      logInfo("401, refreshing token...");
      const response = await postRefreshToken(refreshToken);
      store.setToken(response.data.token);
      logInfo("retry request");
      error.config.headers.Authorization = `Bearer ${response.data.token}`;
      return await cloneRequest(error.config);
    }
  }

  throw error;
};

async function retrieveToken(options?: Partial<InterceptorOptions>) {
  const store = options?.store ?? defaultStore;
  const postRefreshToken = options?.postRefreshToken ?? apiPostRefreshToken;

  const shouldRefresh = store.shouldRefreshToken();
  if (!shouldRefresh) {
    const token: string = store.getToken();
    return token;
  }

  logInfo("refreshing token...");

  const refreshToken = store.getRefreshToken();
  if (!refreshToken) {
    throw new Error("Refresh token is empty");
  }

  const response = await postRefreshToken(refreshToken);

  const token = response.data.token;

  logInfo(`token retrieved: ****${token.substring(token.length - 6)}`);

  store.setToken(token);

  return token;
}
