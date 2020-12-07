import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { headerOptions } from "@navigation/options";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { OnboardingScreen } from "../screens";
import { EnableENF } from "./EnableENF";

export type EnableENFNavigatorParamList = {
  [OnboardingScreen.EnableENF]: { isModal?: boolean };
};

const Stack = createStackNavigator<EnableENFNavigatorParamList>();

export function EnableENFNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
        animationEnabled: !disableAnimations,
      }}
    >
      <Stack.Screen
        name={OnboardingScreen.EnableENF}
        component={EnableENF}
        initialParams={{ isModal: true }}
        options={{ title: t("screenTitles:enableENFModal") }}
      />
    </Stack.Navigator>
  );
}
