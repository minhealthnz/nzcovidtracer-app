import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { NHIScreen, NHIScreenParams } from "../screens";
import { NHIAdd } from "../views/NHIAdd";
import { NHIAdded } from "../views/NHIAdded";
import Privacy from "../views/NHIPrivacy";
import { NHIView } from "../views/NHIView";

const Stack = createStackNavigator<NHIScreenParams>();

export function useNHIScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={NHIScreen.Privacy}
          options={{ title: t("screenTitles:addNHI") }}
          component={Privacy}
        />,
        <Stack.Screen
          name={NHIScreen.Add}
          options={{ title: t("screenTitles:addNHI") }}
          component={NHIAdd}
        />,
        <Stack.Screen
          name={NHIScreen.Added}
          options={{ title: t("screenTitles:nhiAdded") }}
          component={NHIAdded}
        />,
        <Stack.Screen
          name={NHIScreen.View}
          options={{ title: t("screenTitles:nhiView") }}
          component={NHIView}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
