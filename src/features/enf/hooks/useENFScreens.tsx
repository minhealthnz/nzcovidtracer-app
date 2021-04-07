import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ENFScreen, ENFScreenParams } from "../screens";
import { ENFNotSupported } from "../views/ENFNotSupported";
import { ENFSettings } from "../views/ENFSettings";
import { ENFShare } from "../views/ENFShare";
import { ENFShareSuccess } from "../views/ENFShareSuccess";

const Stack = createStackNavigator<ENFScreenParams>();

export function useENFScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={ENFScreen.Settings}
          options={{ title: t("screenTitles:enfSettings") }}
          component={ENFSettings}
        />,
        <Stack.Screen
          name={ENFScreen.Share}
          options={{ title: t("screenTitles:enfShare") }}
          component={ENFShare}
        />,
        <Stack.Screen
          name={ENFScreen.ShareSuccess}
          options={{ title: t("screenTitles:enfShareSuccess") }}
          component={ENFShareSuccess}
        />,
        <Stack.Screen
          name={ENFScreen.NotSupported}
          options={{ title: t("screenTitles:enfSettings") }}
          component={ENFNotSupported}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
