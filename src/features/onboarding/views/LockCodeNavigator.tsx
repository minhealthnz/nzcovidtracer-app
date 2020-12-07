import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { headerOptions } from "@navigation/options";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { OnboardingScreen } from "../screens";
import { LockCode } from "./LockCode";

export type LockCodeNavigatorParamList = {
  [OnboardingScreen.LockCode]: undefined;
};

const Stack = createStackNavigator<LockCodeNavigatorParamList>();

export function LockCodeNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        // TODO: Refactor all Navigators to use same options
        ...headerOptions,
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
        animationEnabled: !disableAnimations,
      }}
    >
      <Stack.Screen
        name={OnboardingScreen.LockCode}
        component={LockCode}
        options={{ title: t("screenTitles:lockCode") }}
      />
    </Stack.Navigator>
  );
}
