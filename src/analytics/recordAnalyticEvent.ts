import { createLogger } from "@logger/createLogger";
import { AnalyticsEvent, EventPayloads } from "analytics/events";

const { logWarning, logInfo } = createLogger("analytics");

type ValueOf<T> = T[keyof T];

export function recordAnalyticEvent(
  eventName: Exclude<ValueOf<typeof AnalyticsEvent>, keyof EventPayloads>,
): void;

export function recordAnalyticEvent<T extends keyof EventPayloads>(
  eventName: T,
  payload: EventPayloads[T],
): void;

export function recordAnalyticEvent(
  eventName: ValueOf<typeof AnalyticsEvent>,
  payload?: {
    attributes?: Record<string, string>;
    metrics?: Record<string, number>;
  },
) {
  try {
    const { Analytics } = require("@aws-amplify/analytics");
    Analytics.record({
      name: eventName,
      ...payload,
    });
    logInfo(
      `Pinpoint analytics recorded: ${eventName} payload: ${
        payload ? JSON.stringify(payload) : "<empty>"
      }`,
    );
  } catch (err) {
    logWarning(err);
  }
}
