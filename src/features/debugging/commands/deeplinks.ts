import { customScheme } from "@linking/matchers";
import { Linking } from "react-native";

import config from "../../../config";
import { TestCommand } from "../testCommand";

export const buildDeeplink = (url: string, name: string): TestCommand => {
  return {
    command: `link-${url}`,
    title: `Deep link to: ${name}`,
    run() {
      Linking.openURL(url);
    },
  };
};

export const linkDashboard = buildDeeplink(
  `${customScheme}//dashboard/today`,
  "Dashboard",
);

export const linkResources = buildDeeplink(
  `${customScheme}//dashboard/resources`,
  "Resources",
);

export const linkDiary = buildDeeplink(`${customScheme}//diary`, "Diary");

export const linkNHI = buildDeeplink(`${customScheme}//nhi`, "NHI");

export const linkManualEntry = buildDeeplink(
  `${customScheme}//manualEntry`,
  "Manual entry",
);

const path =
  "scan?data=NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ==";

export const linkScan = buildDeeplink(
  `${config.WebAppBaseUrl}/${path}`,
  "Scan",
);
