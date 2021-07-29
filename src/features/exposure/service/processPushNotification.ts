import { createLogger } from "@logger/createLogger";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import _ from "lodash";

import { mapEvent } from "./mapEvent";
import { processEvents } from "./processEvents";

const { logInfo, logWarning, logError } = createLogger(
  "processPushNotification",
);

export async function processPushNotification(
  notification: FirebaseMessagingTypes.RemoteMessage,
  defaultSystemNotificationBody: string,
) {
  logInfo("Processing push notifications...");

  const payload = validatePayload(notification);

  if (payload == null) {
    return;
  }

  logInfo("Validated push notification payload");

  const events = (payload as any[])
    .map(mapEvent)
    .filter((x) => x != null)
    .map((x) => x!);

  return await processEvents(events, defaultSystemNotificationBody);
}

function validatePayload(
  notification: FirebaseMessagingTypes.RemoteMessage,
): any[] | undefined {
  if (notification.data == null) {
    logWarning("Data is null");
    return;
  }

  let payload: any;

  try {
    payload = JSON.parse(notification.data.payload);
  } catch (err) {
    logError(
      `Failed to parse json: ${JSON.stringify(notification.data.payload)}`,
    );
    return;
  }

  if (!_.isArray(payload)) {
    logError(
      `Expected array, but got ${JSON.stringify(notification.data.payload)}`,
    );
    return;
  }

  return payload;
}
