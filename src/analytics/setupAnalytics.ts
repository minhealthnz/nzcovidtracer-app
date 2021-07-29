import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

import config from "../config";

export const setupAnalytics = () => {
  const { Amplify } = require("@aws-amplify/core");
  const { Auth } = require("@aws-amplify/auth");

  //Configure AWS pinpoint
  Amplify.configure({
    Auth: {
      identityPoolId: config.CognitoIdentityPoolId,
      region: config.CognitoUserPoolRegion,
    },
    Analytics: {
      disabled: false,
      autoSessionRecord: true,
      AWSPinpoint: {
        appId: config.PinpointApplicationId,
        region: config.CognitoUserPoolRegion,
        mandatorySignIn: false,
        endpoint: {
          address: DeviceInfo.getUniqueId(),
          channelType: Platform.OS === "ios" ? "APNS" : "GCM",
          demographic: {
            appVersion: config.APP_VERSION,
            make: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            platform: DeviceInfo.getSystemName(),
            platformVersion: DeviceInfo.getSystemVersion(),
          },
        },
      },
    },
  });

  // Need to call this line. See https://github.com/aws-amplify/amplify-js/issues/4448
  Auth.currentCredentials();
};
