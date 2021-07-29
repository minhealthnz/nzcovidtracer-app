import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ProfileScreen, ProfileScreenParams } from "../screens";
import { Settings } from "../views/Settings";

const Stack = createStackNavigator<ProfileScreenParams>();

export function useProfileScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={ProfileScreen.Settings}
          options={{ title: t("screens:profile:notificationPreferences") }}
          component={Settings}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
