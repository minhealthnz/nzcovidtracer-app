import { _storeRef } from "@lib/storeRefs";
import { createLogger } from "@logger/createLogger";
import jwtDecode from "jwt-decode";

import { setToken } from "../reducer";
import { selectRefreshToken, selectToken } from "../selectors";
import { TokenStore } from "./types";

const { logInfo } = createLogger("ReduxTokenStore");

interface Token {
  exp: number;
}

export class ReduxTokenStore implements TokenStore {
  get store() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store is empty!");
    }
    return store;
  }
  setToken(token: string) {
    this.store.dispatch(setToken(token));
  }
  getToken(): string {
    return selectToken(this.store.getState());
  }
  shouldRefreshToken(now?: Date): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    now = now ?? new Date();
    const t = jwtDecode<Token>(token);
    const tte = t.exp * 1000 - now.getTime();
    logInfo(`time to expire: ${tte / 1000}s`);
    return tte < 2 * 60 * 1000;
  }
  getRefreshToken(): string {
    return selectRefreshToken(this.store.getState());
  }
}
