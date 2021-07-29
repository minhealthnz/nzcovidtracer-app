export const ExposureEvents = {
  ExposureNotificationMatchDetected: "exposureNotificationMatchDetected",
  ExposureNotificationDisplayed: "exposureNotificationDisplayed",
  ExposureNotificationOpened: "exposureNotificationOpened",
  ExposureNotificationFindOutMore: "exposureNotificationFindOutMore",
  CallbackSendPressed: "callbackSendPressed",
  CallbackSubmitPressed: "callbackSubmitPressed",
  CallbackRequested: "callbackRequested",
  DismissCardBeforeCallbackRequest: "dismissCardBeforeCallbackRequest",
  DismissCardAfterCallbackRequest: "dismissCardAfterCallbackRequest",
} as const;

export type ExposureEventPayloads = {
  [ExposureEvents.CallbackRequested]: {
    attributes: {
      alertType: "location" | "enf";
    };
  };
  [ExposureEvents.CallbackSendPressed]: {
    attributes: {
      alertType: "location" | "enf";
    };
  };
  [ExposureEvents.CallbackSubmitPressed]: {
    attributes: {
      alertType: "location" | "enf";
    };
  };
};
