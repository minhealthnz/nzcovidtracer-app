import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { OTPScreen, OTPScreenParams } from "./screens";
import { EnterEmail } from "./views/EnterEmail";
import { VerifyEmail } from "./views/VerifyEmail";

const Stack = createStackNavigator<OTPScreenParams>();

export function useOtpScreens() {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        <Stack.Screen
          name={OTPScreen.EnterEmail}
          component={EnterEmail}
          options={{
            title: t("screenTitles:enterEmail"),
          }}
        />,
        <Stack.Screen
          name={OTPScreen.VerifyEmail}
          component={VerifyEmail}
          options={{
            title: t("screenTitles:verifyEmail"),
          }}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
