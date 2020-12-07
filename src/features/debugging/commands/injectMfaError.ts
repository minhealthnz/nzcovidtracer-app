import { _storeRef } from "@lib/storeRefs";
import { Alert } from "react-native";

import { injectMfaError as injectMfaErrorAction } from "../reducer";
import { TestCommand } from "../testCommand";

export const injectMfaError: TestCommand = {
  command: "injectMfaError",
  title: "Inject Mfa error",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found");
    }
    store.dispatch(injectMfaErrorAction());
    Alert.alert("Done. You can clear the error by relaunching the app.");
  },
};
