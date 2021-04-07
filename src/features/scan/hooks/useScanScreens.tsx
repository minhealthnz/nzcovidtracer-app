import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ScanScreen, ScanScreenParams } from "../screens";
import { ScanNotRecorded } from "../views/ScanNotRecorded";
import { VisitRecordedScreen } from "../views/VisitRecordedScreen";

const Stack = createStackNavigator<ScanScreenParams>();

export function useScanScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={ScanScreen.Recorded}
          options={{ title: t("screenTitles:recorded") }}
          component={VisitRecordedScreen}
        />,
        <Stack.Screen
          name={ScanScreen.ScanNotRecorded}
          options={{ title: t("screenTitles:scanNotRecorded") }}
          component={ScanNotRecorded}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
