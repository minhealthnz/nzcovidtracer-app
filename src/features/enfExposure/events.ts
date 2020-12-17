export const ENFEvent = {
  ENFBannerDisplayed: "enfBannerDisplayed",
  ENFBannerDismissed: "enfBannerDismissed",
  ENFBannerFindOutMore: "enfBannerFindOutMore",
  ENFShareCodesMenuItemPressed: "shareBluetoothTracingCodesMenuItemPressed",
  ENFShareUploadCodeEntered: "shareBluetoothTracingCodesUploadCodeEntered",
  ENFShareUploadCodeSuccess: "shareBluetoothTracingCodesUploadCodeSuccess",
  ENFShareUploadCodeFailure: "shareBluetoothTracingCodesUploadCodeFailure",
  ENFShareSuccess: "shareBluetoothTracingCodesShareKeySuccess",
  ENFDeviceRegisterSuccess: "deviceRegisterSuccess",
  ENFDeviceRegisterFailure: "deviceRegisterFailure",
  ENFEnableButtonPressed: "enfEnableButtonPressed",
  ENFEnableSuccess: "enfEnableSuccess",
  ENFDisableButtonPressed: "enfDisableButtonPressed",
  ENFDisableModalPressed: "enfDisableModalPressed",
  ENFOnboardingEnableSuccess: "enfOnboardingEnableSuccess",
} as const;

export type ENFEventPayloads = {
  [ENFEvent.ENFBannerDisplayed]: {
    attributes: { alertDate: string };
    metrics: {
      riskScore: number;
      daysSinceLastExposure: number;
      matchedKeyCount: number;
    };
  };
  [ENFEvent.ENFBannerDismissed]: {
    metrics: { daysSinceReceived: number };
  };
  [ENFEvent.ENFShareUploadCodeFailure]: {
    error: string;
  };
};
