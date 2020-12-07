import { headerOptions } from "@navigation/options";
import { createStackNavigator } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import Profile from "./Profile";

export type TabProfileParamList = {
  [TabScreen.MyData]: undefined;
};

const Stack = createStackNavigator<TabProfileParamList>();

export function TabProfileNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        animationEnabled: !disableAnimations,
      }}
    >
      <Stack.Screen
        name={TabScreen.MyData}
        component={Profile}
        options={{ title: t("screenTitles:myProfile") }}
      />
    </Stack.Navigator>
  );
}
