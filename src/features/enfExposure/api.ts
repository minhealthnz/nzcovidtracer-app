import { ReminderNotificationConfig } from "@features/reminder/reducer";
import { validateReminderNotificationConfig } from "@features/reminder/util/validateReminderConfig";
import { isIOS } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import Axios, { AxiosResponse } from "axios";
import _ from "lodash";
import * as yup from "yup";

import config from "../../config";

export interface ENFNotificationRiskBucket {
  minRiskScore: number;
  maxRiskScore: number;
  alertTitle: string;
  alertMessage: string;
  alertExpiresInDays: number;
  systemNotification: string;
  linkUrl: string;
  callbackEnabled: boolean;
}

export type ENFNotificationRiskBucketsConfig = ENFNotificationRiskBucket[];

export interface Announcement {
  title: string;
  message: string;
  linkText: string;
  link: string;
  createdAt: string;
  enabled: boolean;
  deepLink?: string;
}

interface VaccinePassDisabledSettingType {
  android?: boolean;
  ios?: boolean;
}
export interface ENFNotificationSettingsRaw {
  testLocationsLink: string;
  announcements?: unknown;
  configurations: ENFNotificationRiskBucketsConfig;
  callbackEnabled?: boolean;
  reminderNotificationConfig?: ReminderNotificationConfig;
  vaccinePassLinkDisabled: VaccinePassDisabledSettingType;
}

export interface ENFNotificationSettings {
  testLocationsLink: string;
  announcements: Announcement[];
  configurations: ENFNotificationRiskBucketsConfig;
  callbackEnabled?: boolean;
  reminderNotificationConfig?: ReminderNotificationConfig;
  vaccinePassDisabled: boolean;
}

const announcementSchema = yup.object<Announcement>().shape({
  title: yup.string().required(),
  message: yup.string().required(),
  linkText: yup.string().required(),
  link: yup.string().required(),
  date: yup.string().required(),
  enabled: yup.boolean().required(),
  deepLink: yup.string().optional(),
});

const announcementsSchema = yup.array().of(announcementSchema);

const { logError } = createLogger("enfExposure/api");

export async function getENFNotificationConfig(): Promise<ENFNotificationSettings> {
  const url = `${config.ENFServerUrl}/settings/notification`;
  const response: AxiosResponse<ENFNotificationSettingsRaw> = await Axios.get(
    url,
  );
  const raw = response.data;

  const result: ENFNotificationSettings = {
    ...raw,
    announcements: parseAnnouncement(raw.announcements),
    reminderNotificationConfig: validateReminderNotificationConfig(
      raw.reminderNotificationConfig,
    ),
    vaccinePassDisabled: parseVaccinePassDisabled(raw?.vaccinePassLinkDisabled),
  };
  return result;
}

export const parseAnnouncement = (payload: unknown) => {
  try {
    return _.compact(announcementsSchema.cast(payload) || []);
  } catch (err) {
    logError("Failed to parse announcements");
    return [];
  }
};

const parseVaccinePassDisabled = (
  payload: VaccinePassDisabledSettingType,
): boolean => {
  try {
    return !!(payload && payload[isIOS ? "ios" : "android"]);
  } catch (err) {
    return false;
  }
};
