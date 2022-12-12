import { setMatch } from "@features/exposure/reducer";
import { processPushNotification } from "@features/exposure/service/processPushNotification";
import { setNfcDebounce } from "@features/nfc/reducer";
import {
  selectLastScannedEntry,
  selectNfcDebounce,
} from "@features/nfc/selectors";
import { OnboardingScreen } from "@features/onboarding/screens";
import {
  selectDeviceRegistered,
  selectHasOnboarded,
  selectHasSeenEnf,
  selectSessionType,
} from "@features/onboarding/selectors";
import { EnableENFNavigator } from "@features/onboarding/views/EnableENFNavigator";
import { LockCodeNavigator } from "@features/onboarding/views/LockCodeNavigator";
import { OnboardingStack } from "@features/onboarding/views/OnboardingStack";
import { SplashScreen as DummySplashScreen } from "@features/onboarding/views/SplashScreen";
import { setEnfEnableNotificationSent } from "@features/verification/reducer";
import { selectEnfEnableNotificationSent } from "@features/verification/selectors";
import { notifyRegisterDeviceRetrySuccess } from "@features/verification/service/notifyRegisterDeviceRetrySuccess";
import { createLogger } from "@logger/createLogger";
import { logPerformance } from "@logger/logPerformance";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useExposure } from "react-native-exposure-notification-service";
import SplashScreen from "react-native-splash-screen";
import { useDispatch, useSelector } from "react-redux";

import { disableAnimations } from "../config";
import { MainStack } from "./MainStack";
import { MainStackScreen, TabScreen } from "./screens";

export type ModalStackParamList = {
  [TabScreen.Navigator]: undefined;
  [OnboardingScreen.Navigator]: undefined;
  [MainStackScreen.Navigator]: undefined;
  [OnboardingScreen.Splash]: undefined;
  [OnboardingScreen.LockCodeNavigator]: undefined;
  [OnboardingScreen.EnableENFNavigator]: undefined;
};

const Stack = createStackNavigator<ModalStackParamList>();

const { logInfo, logWarning, logError } = createLogger("ModalStack");

export function ModalStack() {
  const sessionType = useSelector(selectSessionType);
  const hasOnboarded = useSelector(selectHasOnboarded);
  const lastScannedEntry = useSelector(selectLastScannedEntry);

  const shouldHideSplashScreen = sessionType !== "unknown";
  const nfcDebounce = useSelector(selectNfcDebounce);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (nfcDebounce) {
      Alert.alert(
        t("nfcNotification:defaultSystemNotificationTitle"),
        t("nfcNotification:defaultSystemNotificationBody", {
          locationName: lastScannedEntry.name,
        }),
        [
          {
            text: t("nfcNotification:okay"),
            onPress: () => {
              dispatch(setNfcDebounce(false));
            },
          },
        ],
        { cancelable: false },
      );
    }
    return;
  }, [nfcDebounce, dispatch, lastScannedEntry, t]);

  useEffect(() => {
    if (shouldHideSplashScreen) {
      SplashScreen.hide();
      logPerformance("launch", `splash screen hidden "${sessionType}"`);
    }
  }, [shouldHideSplashScreen, sessionType]);

  //Timeout scenario for local notification.
  const hasSeenEnf = useSelector(selectHasSeenEnf);
  const deviceRegistered = useSelector(selectDeviceRegistered);
  const enfEnableNotificationSent = useSelector(
    selectEnfEnableNotificationSent,
  );
  const { supported: enfSupported } = useExposure();

  useEffect(() => {
    if (
      !enfEnableNotificationSent &&
      hasOnboarded &&
      !hasSeenEnf &&
      deviceRegistered === "success" &&
      enfSupported
    ) {
      notifyRegisterDeviceRetrySuccess()
        .then(() => {
          dispatch(setEnfEnableNotificationSent());
          logInfo("Show local notification for attestation");
        })
        .catch((err) => {
          logError("Could not show local notification for attestation", err);
        });
    }
  }, [
    hasOnboarded,
    hasSeenEnf,
    deviceRegistered,
    enfEnableNotificationSent,
    dispatch,
    enfSupported,
  ]);

  useEffect(() => {
    // TODO rewrite as saga
    const unsubscribe = messaging().onMessage(
      async (message: FirebaseMessagingTypes.RemoteMessage) => {
        if (message.data == null) {
          logWarning("Data in the wrong format");
          return;
        }
        switch (message.data.type) {
          case "exposure-event-notifications":
            try {
              const match = await processPushNotification(
                message,
                t("exposureNotification:defaultSystemNotificationBody"),
              );
              if (match != null) {
                dispatch(setMatch(match));
              }
            } catch (err) {
              logWarning(err as string);
            }
            break;
          default:
            logWarning("Unknown notification type");
            break;
        }
      },
    );
    return unsubscribe;
  }, [t, dispatch]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !disableAnimations,
        headerTitleAllowFontScaling: false,
        headerBackAllowFontScaling: false,
      }}
      mode="modal"
    >
      {sessionType === "unknown" ? (
        <Stack.Screen
          name={OnboardingScreen.Splash}
          component={DummySplashScreen}
        />
      ) : hasOnboarded ? (
        <>
          <Stack.Screen
            name={MainStackScreen.Navigator}
            component={MainStack}
          />
          <Stack.Screen
            name={OnboardingScreen.LockCodeNavigator}
            options={{ title: t("screenTitles:lockCode") }}
            component={LockCodeNavigator}
          />
          <Stack.Screen
            name={OnboardingScreen.EnableENFNavigator}
            options={{ title: t("screenTitles:enableENF") }}
            component={EnableENFNavigator}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={OnboardingScreen.Navigator}
            component={OnboardingStack}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
