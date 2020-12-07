import { injectInsertError as injectInsertErrorAction } from "@features/diary/reducer";
import { _storeRef } from "@lib/storeRefs";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const injectInsertError: TestCommand = {
  command: "injectInsertError",
  title: "Inject scan error",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found");
    }
    store.dispatch(injectInsertErrorAction());
    Alert.alert("Done. You can clear the error by relaunching the app.");
  },
};
