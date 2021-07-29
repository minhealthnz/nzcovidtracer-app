export const ENFEvent = {
  ENFBannerDisplayed: "enfBannerDisplayed",
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
  ENFBluetoothInactiveNotificationOpened:
    "enfBluetoothInactiveNotificationOpened",
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
  [ENFEvent.ENFShareUploadCodeFailure]: {
    error: string;
  };
};
