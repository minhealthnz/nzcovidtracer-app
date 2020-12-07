import config from "../config";
import { alert } from "./transports/alert";
import { console } from "./transports/console";
import { reactotron } from "./transports/reactotron";
import { createSession as session } from "./transports/session";
import { Transport } from "./types";

export function createTransports(): ReadonlyArray<Transport> {
  const isDebug = __DEV__;
  const isDev = config.IsDev;

  // Local development
  if (isDebug) {
    return [reactotron(), console(), session()];
  }

  // Dev builds
  if (isDev) {
    return [alert(), console(), session()];
  }

  // Release
  return [];
}
