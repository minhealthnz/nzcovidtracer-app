import { createLogger } from "@logger/createLogger";
import moment from "moment-timezone";

import { ensureString } from "./ensureString";
import { ExposureEvent } from "./types";

const { logWarning } = createLogger("exposure/mapEvents");

export function mapEvent(payload: any): ExposureEvent | undefined {
  const notificationId: string | undefined = ensureString(
    payload.notificationId,
  );
  const eventId: string | undefined = ensureString(payload.eventId);
  const start: string | undefined = ensureString(payload.start);
  const end: string | undefined = ensureString(payload.end);
  const glnHash: string | undefined = ensureString(payload.glnHash);
  const systemNotificationBody: string | undefined = ensureString(
    payload.systemNotificationBody,
  );
  const appBannerTitle: string | undefined = ensureString(
    payload.appBannerTitle,
  );
  const appBannerBody: string | undefined = ensureString(payload.appBannerBody);
  const appBannerLinkLabel: string | undefined = ensureString(
    payload.appBannerLinkLabel,
  );
  const appBannerLinkUrl: string | undefined = ensureString(
    payload.appBannerLinkUrl,
  );
  const appBannerRequestCallbackEnabled: string | undefined = ensureString(
    payload.appBannerRequestCallbackEnabled,
  );

  if (
    notificationId == null ||
    eventId == null ||
    start == null ||
    end == null ||
    glnHash == null
  ) {
    logWarning("data in the wrong format");
    return undefined;
  }

  return {
    notificationId,
    eventId,
    start: moment(start).toDate(),
    end: moment(end).toDate(),
    glnHash,
    systemNotificationBody,
    appBannerTitle,
    appBannerBody,
    appBannerLinkLabel,
    appBannerLinkUrl,
    appBannerRequestCallbackEnabled:
      appBannerRequestCallbackEnabled === "true" ||
      appBannerRequestCallbackEnabled === "1",
  };
}
