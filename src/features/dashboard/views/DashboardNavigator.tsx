import { grid2x } from "@constants";
import { headerOptions } from "@navigation/options";
import { createStackNavigator } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { Dashboard } from "./Dashboard";

type DashboardParamList = {
  [TabScreen.Home]: undefined;
};
const Stack = createStackNavigator<DashboardParamList>();

const UniteLogo = styled.Image`
  margin-left: ${grid2x}px;
  width: 34px;
  height: 34px;
`;

export function DashboardNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        headerLeft: () => (
          <UniteLogo
            accessible
            accessibilityLabel={t("accessibility:graphic:COVID19OfficialLogo")}
            source={require("../assets/icons/unite-logo.png")}
          />
        ),
      }}
    >
      <Stack.Screen
        name={TabScreen.Home}
        component={Dashboard}
        options={{ title: t("screenTitles:dashboard") }}
      />
    </Stack.Navigator>
  );
}
