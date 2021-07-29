import {
  createMatchesFromEvents,
  getMostRecentUnacknowledgedMatch,
} from "@db/entities/checkInItemMatch";
import { createLogger } from "@logger/createLogger";
import PushNotification from "react-native-push-notification";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { createChannel } from "./createChannel";
import { ExposureEvent, NotificationTypeMatchFound } from "./types";

const { logInfo } = createLogger("exposure/processEvents");

export async function processEvents(
  events: ExposureEvent[],
  defaultSystemNotificationBody: string,
) {
  logInfo("finding matches from events...");
  const created = await createMatchesFromEvents(events);
  const match = await getMostRecentUnacknowledgedMatch();

  if (created.length === 0 || match == null) {
    logInfo("no matches found");
    return undefined;
  }

  recordAnalyticEvent(AnalyticsEvent.ExposureNotificationMatchDetected);
  logInfo("match found!");

  const message = match.systemNotificationBody
    ? match.systemNotificationBody
    : defaultSystemNotificationBody;

  const channelId = await createChannel();

  PushNotification.localNotification({
    // iOS + Android
    id: 0,
    message,
    number: 1,
    soundName: "default",

    // Android
    channelId,
    onlyAlertOnce: true,
    largeIcon: "ic_launcher",
    // TODO verify
    smallIcon: "ic_notification",
    autoCancel: true,
    vibrate: true,
    priority: "high",
    // TODO title
    userInfo: {
      type: NotificationTypeMatchFound,
      isLocal: true,
    },
  });

  recordAnalyticEvent(AnalyticsEvent.ExposureNotificationDisplayed);

  return match;
}
