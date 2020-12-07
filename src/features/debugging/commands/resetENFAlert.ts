import { TestCommand } from "@features/debugging/testCommand";
import { dismissEnfAlert } from "@features/enfExposure/reducer";
import { _storeRef } from "@lib/storeRefs";
import { Alert } from "react-native";

export const resetENFAlert: TestCommand = {
  command: "resetENFAlert",
  title: "Un-acknowledge ENF alert",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found!");
    }
    store.dispatch(dismissEnfAlert(0));
    Alert.alert(
      "If there is dismissed ENF alert it will be shown on the Dashboard again",
    );
  },
};
