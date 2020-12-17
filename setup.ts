import config from "./src/config";

if (__DEV__ || config.IsDev) {
  import("./reactotronConfig");
}

import "react-native-gesture-handler";
import "./i18n";

import Auth from "@aws-amplify/auth";
import Amplify from "@aws-amplify/core";
import covidTracker from "@db/covidTracerMigration";
import { createPublic } from "@db/create";
import { formatEnv } from "@features/debugging/commands/copyEnvVar";
import { processPushNotification } from "@features/exposure/service/processPushNotification";
import { createLogger } from "@logger/createLogger";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Analytics } from "aws-amplify";
import { dirname } from "path";
import { AppState, AppStateStatus, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { enableScreens } from "react-native-screens";

import { configure as configurePush } from "./src/notifications";

enableScreens();

const { logError, logInfo } = createLogger("setup");

logInfo("app launched with env variables:" + "\n" + formatEnv(true));

async function applyPublicDbFileProtection() {
  if (Platform.OS === "ios" && covidTracker.applyPublicFileProtection != null) {
    const db = await createPublic();
    const dir = dirname(db.path);
    db.close();
    await covidTracker.applyPublicFileProtection(dir);
  }
}

messaging().setBackgroundMessageHandler(
  async (message: FirebaseMessagingTypes.RemoteMessage) => {
    logInfo("message being processed in background!");
    await applyPublicDbFileProtection();
    try {
      await processPushNotification(
        message,
        // TODO figure out how to translate this
        "You may have been in contact with COVID-19. Tap for more information.",
      );
    } catch (err) {
      logError(err);
    }
  },
);

applyPublicDbFileProtection().catch(logError);

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
      region: config.PinpointRegion,
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

configurePush();

logInfo(`app state ${AppState.currentState}`);

AppState.addEventListener("change", (value: AppStateStatus) => {
  logInfo(`app state ${value}`);
});

AppState.addEventListener("change", (value) => {
  if (value === "active") {
    ExposureNotificationModule.exposureEnabled()
      .then((isENFEnabled) => {
        logInfo(
          "Update isENFEnabled via Analytics.updateEndpoint with value: " +
            isENFEnabled,
        );

        return Analytics.updateEndpoint({
          attributes: {
            isENFEnabled: [isENFEnabled],
          },
        });
      })
      .catch(logError);
  }
});
