export interface ExposureEvent {
  notificationId: string;
  eventId: string;
  start: Date;
  end: Date;
  glnHash: string;
  systemNotificationBody?: string;
  appBannerTitle?: string;
  appBannerBody?: string;
  appBannerLinkLabel?: string;
  appBannerLinkUrl?: string;
  appBannerRequestCallbackEnabled: boolean;
}

export const NotificationTypeMatchFound = "MatchFound";

export const errors = { requestCallback: { network: "network_error" } };
