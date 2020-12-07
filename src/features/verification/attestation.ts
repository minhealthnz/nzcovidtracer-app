import RNGoogleSafetyNet from "react-native-google-safetynet";
import RNIOS11DeviceCheck from "react-native-ios11-devicecheck";

export const AndroidAttestationService = {
  sendRequest(nonce: string, safetyNetKey: string): Promise<string> {
    return RNGoogleSafetyNet.sendAttestationRequestJWT(nonce, safetyNetKey);
  },
};

export const IOSDeviceCheckService = {
  getToken(): Promise<string> {
    return RNIOS11DeviceCheck.getToken();
  },
};
