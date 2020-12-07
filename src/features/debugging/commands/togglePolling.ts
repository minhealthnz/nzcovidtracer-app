import { disablePolling } from "@features/exposure/reducer";
import { _storeRef } from "@lib/storeRefs";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const disable: TestCommand = {
  command: "disablePolling",
  title: "Disable polling",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found!");
    }
    store.dispatch(disablePolling(true));
    Alert.alert("Polling disabled.");
  },
};

export const enable: TestCommand = {
  command: "enablePolling",
  title: "Enable polling",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found!");
    }
    store.dispatch(disablePolling(false));
    Alert.alert("Polling enabled!");
  },
};
