import { createLogger } from "@logger/createLogger";
import Axios from "axios";

import config from "../../../config";
import {
  refreshTokenIfNeeded,
  refreshTokenWhenUnauthorized,
} from "./interceptors";

const { logError } = createLogger("verification/api");

/**
 * Authenticated client that injects [Authorization = Bearer token] - use this for authenticated API calls against Config.ENFServerUrl
 * Bear in mind this is accessing the store directly - so only use this client for API calls post store startup.
 */
export const AuthenticatedENFClient = Axios.create({
  baseURL: config.ENFServerUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

AuthenticatedENFClient.interceptors.request.use(
  refreshTokenIfNeeded,
  (error) => {
    logError(error);
    return Promise.reject(error);
  },
);

AuthenticatedENFClient.interceptors.response.use((conf) => {
  return conf;
}, refreshTokenWhenUnauthorized);
