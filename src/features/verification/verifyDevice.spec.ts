import { Platform } from "react-native";

import { getPayload } from "./verifyDevice";

const MOCK_RESULT = "attestation_result";

const MockAndroidAttestationService = {
  sendRequest: jest.fn((_nonce, _safetyNetKey) => Promise.resolve(MOCK_RESULT)),
};

const MockIOSDeviceCheckService = {
  getToken: jest.fn(() => Promise.resolve(MOCK_RESULT)),
};

const ANDROID_TEST_DATA = [
  {
    AndroidAttestationService: MockAndroidAttestationService,
    IOSDeviceCheckService: MockIOSDeviceCheckService,
    platform: "android" as typeof Platform.OS,
    nonce: "nonce",
    safetyNetKey: "safetyNetKey",
    result: MOCK_RESULT,
  },
];

const IOS_TEST_DATA = [
  {
    AndroidAttestationService: MockAndroidAttestationService,
    IOSDeviceCheckService: MockIOSDeviceCheckService,
    platform: "ios" as typeof Platform.OS,
    nonce: "",
    safetyNetKey: "safetyNetKey",
    result: MOCK_RESULT,
  },
];

describe("#getPayload", () => {
  it.each(ANDROID_TEST_DATA)(
    "call Android's SafetyNet Attestation service",
    async ({
      platform,
      nonce,
      safetyNetKey,
      result,
      AndroidAttestationService,
      IOSDeviceCheckService,
    }) => {
      const response = await getPayload(
        platform,
        nonce,
        safetyNetKey,
        AndroidAttestationService,
        IOSDeviceCheckService,
      );

      expect(MockAndroidAttestationService.sendRequest).toBeCalled();
      expect(response).toEqual(result);
    },
  );

  it.each(IOS_TEST_DATA)(
    "call Apple's DeviceCheck service",
    async ({
      platform,
      nonce,
      safetyNetKey,
      result,
      AndroidAttestationService,
      IOSDeviceCheckService,
    }) => {
      const response = await getPayload(
        platform,
        nonce,
        safetyNetKey,
        AndroidAttestationService,
        IOSDeviceCheckService,
      );

      expect(MockIOSDeviceCheckService.getToken).toBeCalled();
      expect(response).toEqual(result);
    },
  );
});
