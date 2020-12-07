import Axios from "axios";

import config from "../../config";

export interface ApiExposureEvent {
  notificationId?: string;
  eventId?: string;
  start?: string;
  end?: string;
  glnHash?: string;
  systemNotificationBody?: string;
  appBannerTitle?: string;
  appBannerBody?: string;
  appBannerLinkLabel?: string;
  appBannerLinkUrl?: string;
  appBannerRequestCallbackEnabled?: string;
}
export interface ExposureEventsResponse {
  items: ApiExposureEvent[];
}

export async function getExposureEvents() {
  const url = `${config.ExposureEventsBaseUrl}/current-exposure-events.json`;

  const response = await Axios.get(url);
  return response.data;
}

export interface ExposureEventMatchV2 {
  eventId: string;
  notificationId: string;
  phone: string;
  gln: string;
  firstName?: string;
  lastName?: string;
  contactNotes?: string;
}

export async function requestCallback(body: ExposureEventMatchV2) {
  const url = `${config.ApiBaseUrl}/v2/exposure-event-matches`;
  await Axios.post(url, body);
}
