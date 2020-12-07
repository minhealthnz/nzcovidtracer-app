import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { DebugScreen } from "../screens";
import { DebugMenu } from "./DebugMenu";

export type DebugMenuStackParamList = {
  [DebugScreen.Menu]: undefined;
};

const Stack = createStackNavigator<DebugMenuStackParamList>();

export function DebugMenuStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAllowFontScaling: false,
        headerBackAllowFontScaling: false,
      }}
    >
      <Stack.Screen
        name={DebugScreen.Menu}
        component={DebugMenu}
        options={{
          title: "Debug menu",
          headerTitleAllowFontScaling: false,
          headerBackAllowFontScaling: false,
        }}
      />
    </Stack.Navigator>
  );
}
