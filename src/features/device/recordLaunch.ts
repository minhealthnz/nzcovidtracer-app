import migration from "@db/covidTracerMigration";
import { createLogger } from "@logger/createLogger";
import clamp from "lodash/clamp";

import { AnalyticsEvent } from "../../analytics/events";
import { recordAnalyticEvent } from "../../analytics/recordAnalyticEvent";

const { logInfo } = createLogger("analytics/recordLaunch");

let recorded = false;

export const recordLaunch = async () => {
  // In memory flag to prevent multiple logs in debug mode
  if (recorded) {
    return;
  }
  recorded = true;

  const lastLaunchTime = await migration.readLastLaunchTime();
  const jsLaunchTime = clamp(
    (new Date().getTime() - lastLaunchTime) / 1000,
    0,
    20,
  );
  logInfo(`time since last launch: ${jsLaunchTime}`);

  recordAnalyticEvent(AnalyticsEvent.Launch, {
    metrics: {
      jsLaunchTime,
    },
  });
};
