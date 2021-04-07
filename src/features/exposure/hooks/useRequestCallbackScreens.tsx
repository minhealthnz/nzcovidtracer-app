import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RequestCallbackScreen } from "../screens";
import RequestCallback from "../views/RequestCallback";
import RequestCallbackConfirm from "../views/RequestCallbackConfirm";

export type RequestCallbackScreenParams = {
  [RequestCallbackScreen.RequestCallback]: { alertType: "location" | "enf" };
  [RequestCallbackScreen.Confirm]: {
    alertType: "location" | "enf";
    firstName: string;
    lastName: string;
    phone: string;
    notes: string;
  };
};

const Stack = createStackNavigator<RequestCallbackScreenParams>();

export function useRequestCallbackScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={RequestCallbackScreen.RequestCallback}
          options={{ title: t("screenTitles:requestCallback") }}
          component={RequestCallback}
        />,
        <Stack.Screen
          name={RequestCallbackScreen.Confirm}
          options={{ title: t("screenTitles:requestCallbackConfirm") }}
          component={RequestCallbackConfirm}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
