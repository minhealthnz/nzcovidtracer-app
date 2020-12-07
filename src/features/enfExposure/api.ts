import Axios, { AxiosResponse } from "axios";

import config from "../../config";

export interface ENFNotificationRiskBucket {
  minRiskScore: number;
  maxRiskScore: number;
  alertTitle: string;
  alertMessage: string;
  systemNotification: string;
  linkUrl: string;
  callbackEnabled: boolean;
}

export type ENFNotificationRiskBucketsConfig = ENFNotificationRiskBucket[];

export interface ENFNotificationSettings {
  configurations: ENFNotificationRiskBucketsConfig;
}

export async function getENFNotificationConfig(): Promise<
  ENFNotificationSettings
> {
  const url = `${config.ENFServerUrl}/settings/notification`;
  const response: AxiosResponse<ENFNotificationSettings> = await Axios.get(url);
  return response.data;
}
