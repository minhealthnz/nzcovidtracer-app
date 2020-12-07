import { headerOptions } from "@navigation/options";
import { createStackNavigator } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { Scan } from "./Scan";

export type TabScanParamList = {
  [TabScreen.RecordVisit]: undefined;
};

const Stack = createStackNavigator<TabScanParamList>();

export function TabScanNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        animationEnabled: !disableAnimations,
      }}
    >
      <Stack.Screen
        name={TabScreen.RecordVisit}
        options={{ title: t("screenTitles:recordAVisit") }}
        component={Scan}
      />
    </Stack.Navigator>
  );
}
