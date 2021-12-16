import config from "./src/config";

if (__DEV__ || config.IsDev) {
  import("./reactotronConfig");
}

import "react-native-gesture-handler";
import "./i18n";

import covidTracker from "@db/covidTracerMigration";
import { createPublic } from "@db/create";
import { formatEnv } from "@features/debugging/commands/copyEnvVar";
import { recordLaunch } from "@features/device/recordLaunch";
import { setPassUrl } from "@features/device/reducer";
import { processPushNotification } from "@features/exposure/service/processPushNotification";
import { isIOS } from "@lib/helpers";
import { _storeRef } from "@lib/storeRefs";
import { createLogger } from "@logger/createLogger";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { dirname } from "path";
import {
  AppState,
  AppStateStatus,
  LogBox,
  NativeModules,
  Platform,
} from "react-native";
import ExposureNotificationModule from "react-native-exposure-notification-service";
import { enableScreens } from "react-native-screens";

import { setupAnalytics } from "./src/analytics/setupAnalytics";
import { configure as configurePush } from "./src/notifications";

const { logError, logInfo } = createLogger("setup");

if (config.HideLogs) {
  LogBox.ignoreAllLogs();
}

LogBox.ignoreLogs([
  /AsyncStorage has been extracted from .*/,
  /Require cycle: .*ws-amplify.*/,
]);

enableScreens();

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

setupAnalytics();

configurePush();

logInfo(`app state ${AppState.currentState}`);

// Get the current state of the wallet pass
const getWalletPass = () => {
  const { WalletManager } = NativeModules;
  if (WalletManager && isIOS) {
    const store = _storeRef.current;
    WalletManager.getPassLink("pass.nz.govt.health.cert.nzcp")
      .then((passUrl: string) => {
        store?.dispatch(setPassUrl(passUrl ? passUrl : null));
        logInfo(`PASSURL is: ${passUrl}`);
      })
      .catch((error: string) => {
        logError(`ERROR URL is: ${error}`);
      });
  }
};

AppState.addEventListener("change", (value: AppStateStatus) => {
  logInfo(`app state ${value}`);
  if (value === "active") {
    getWalletPass();
    ExposureNotificationModule.exposureEnabled()
      .then((isENFEnabled) => {
        logInfo(
          `Update isENFEnabled via Analytics.updateEndpoint with value: ${isENFEnabled}`,
        );

        const { Analytics } = require("aws-amplify");
        return Analytics.updateEndpoint({
          attributes: {
            isENFEnabled: [isENFEnabled],
          },
        });
      })
      .catch(logError);
  }
});

(async () => {
  try {
    await recordLaunch();
  } catch (err) {
    logError(err);
  }
})();
