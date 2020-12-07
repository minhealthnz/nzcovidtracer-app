import { ReduxState } from "@domain/types";
import { _storeRef } from "@lib/storeRefs";
import Clipboard from "@react-native-community/clipboard";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const showSubscription: TestCommand = {
  command: "showSubscription",
  title: "Show subscription",
  run() {
    const store = _storeRef.current;
    if (store == null) {
      throw new Error("Store not found");
    }
    const state: ReduxState = store.getState();
    const permission = state.device.notificationPermission;
    const hasTopic = state.device.subscriptions.all?.fullfilled;
    const subscribed = permission === "granted" && hasTopic;

    const status = `[permission=${permission}] [topic=${
      hasTopic ? "all" : "none"
    }]`;

    Clipboard.setString(status);

    Alert.alert(subscribed ? "Subscribed!" : "Not subscribed", status);
  },
};
