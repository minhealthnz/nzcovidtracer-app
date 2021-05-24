import { Linking } from "react-native";

import { TestCommand } from "../testCommand";

export const buildDeeplink = (
  prefix: string,
  path: string,
  name: string,
): TestCommand => {
  const url = prefix + path;
  return {
    command: `link-${url}`,
    title: `Deep link to: ${name}`,
    run() {
      Linking.openURL(url);
    },
  };
};

const appPrefix = "nzcovidtracer://";

export const linkDashboard = buildDeeplink(
  appPrefix,
  "dashboard/today",
  "Dashboard",
);

export const linkResources = buildDeeplink(
  appPrefix,
  "dashboard/resources",
  "Resources",
);

export const linkDiary = buildDeeplink(appPrefix, "diary", "Diary");

export const linkNHI = buildDeeplink(appPrefix, "nhi", "NHI");

export const linkManualEntry = buildDeeplink(
  appPrefix,
  "manualEntry",
  "Manual entry",
);
