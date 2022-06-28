import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { DiaryScreen, DiaryScreenParams } from "@features/diary/screens";
import { CopiedDiary } from "@features/diary/views/CopiedDiary";
import { ViewDiary } from "@features/diary/views/ViewDiary";
import { OTPScreen, OTPScreenParams } from "@features/otp/screens";
import { EnterEmail } from "@features/otp/views/EnterEmail";
import { VerifyEmail } from "@features/otp/views/VerifyEmail";
import { headerOptions } from "@navigation/options";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { disableAnimations } from "../../../config";
import { OnboardingScreen } from "../screens";
import { selectInitialScreen } from "../selectors";
import { EnableAlerts } from "./EnableAlerts";
import { EnableENF } from "./EnableENF";
import { ExistingUser } from "./ExistingUser";
import { MultipleDiaries } from "./MultipleDiaries";
import { PrivacyStatement } from "./PrivacyStatement";
import { Thanks } from "./Thanks";
import { ValueStatements } from "./ValueStatements";

export type OnboardingScreenParams = {
  [OnboardingScreen.Navigator]: undefined;
  [OnboardingScreen.ExistingUser]: undefined;
  [OnboardingScreen.MultipleDiaries]: undefined;
  [OnboardingScreen.ValueStatements]: undefined;
  [OnboardingScreen.PrivacyStatement]: undefined;
  [OnboardingScreen.EnableAlerts]: undefined;
  [OnboardingScreen.Thanks]: undefined;
  [OnboardingScreen.Splash]: undefined;
  [OnboardingScreen.EnableENF]: { isModal?: boolean } | undefined;
};

export type OnboardingStackParamList = OnboardingScreenParams &
  OTPScreenParams &
  Pick<DiaryScreenParams, DiaryScreen.ViewDiary | DiaryScreen.CopiedDiary>;

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  const { t } = useTranslation();
  const initialScreen = useSelector(selectInitialScreen);

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
        animationEnabled: !disableAnimations,
        ...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName={initialScreen}
    >
      <Stack.Screen
        name={OnboardingScreen.ValueStatements}
        component={ValueStatements}
        options={{
          title: t("screenTitles:existingUser"),
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={OnboardingScreen.PrivacyStatement}
        component={PrivacyStatement}
        options={{
          title: t("screenTitles:privacyStatement"),
        }}
      />

      <Stack.Screen
        name={OnboardingScreen.EnableENF}
        component={EnableENF}
        options={{
          title: t("screenTitles:enableENF"),
        }}
      />

      <Stack.Screen
        name={OnboardingScreen.ExistingUser}
        component={ExistingUser}
        options={{
          title: t("screenTitles:existingUser"),
        }}
      />
      <Stack.Screen
        name={OnboardingScreen.MultipleDiaries}
        component={MultipleDiaries}
        options={{
          title: t("screenTitles:multipleDiaries"),
        }}
      />
      <Stack.Screen
        name={OnboardingScreen.EnableAlerts}
        component={EnableAlerts}
        options={{
          title: t("screenTitles:enableAlerts"),
        }}
      />
      <Stack.Screen
        name={OTPScreen.EnterEmail}
        component={EnterEmail}
        options={{
          title: t("screenTitles:enterEmail"),
        }}
      />
      <Stack.Screen
        name={OTPScreen.VerifyEmail}
        component={VerifyEmail}
        options={{
          title: t("screenTitles:verifyEmail"),
        }}
      />
      <Stack.Screen
        name={OnboardingScreen.Thanks}
        component={Thanks}
        options={{ title: t("screenTitles:thanks") }}
      />
      <Stack.Screen
        name={DiaryScreen.ViewDiary}
        component={ViewDiary}
        options={{ title: t("screenTitles:viewDiary") }}
      />
      <Stack.Screen
        name={DiaryScreen.CopiedDiary}
        component={CopiedDiary}
        options={{ title: t("screenTitles:copiedDiary") }}
      />
    </Stack.Navigator>
  );
}
