import { ReduxState } from "@domain/types";
import { PermissionStatus } from "@features/device/reducer";
import { SubscriptionState } from "@features/device/reducer";
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

    const status = formatStatus(
      state.device.notificationPermission,
      state.device.subscriptions,
    );
    Clipboard.setString(status);

    const subscribed = state.device.notificationPermission === "granted";

    Alert.alert(subscribed ? "Subscribed!" : "Not subscribed", status);
  },
};

export const formatStatus = (
  permission: PermissionStatus,
  subscriptions: { [name: string]: SubscriptionState },
) => {
  const topics = Object.entries(subscriptions)
    .map(
      ([topic, status]) =>
        `[${topic}=${status.fullfilled ? "subscribed" : "not subscribed"}]`,
    )
    .join(" ");

  return `[permission=${permission}] ${topics}`;
};
