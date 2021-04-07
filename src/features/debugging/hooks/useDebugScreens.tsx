import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";

import config from "../../../config";
import { DebugScreen } from "../screens";
import { DebugMenu } from "../views/DebugMenu";

export type DebugScreenParams = {
  [DebugScreen.Menu]: undefined;
};

const Stack = createStackNavigator<DebugScreenParams>();

export function useDebugScreens() {
  return useMemo(
    () =>
      config.IsDev
        ? [
            <Stack.Screen
              name={DebugScreen.Menu}
              component={DebugMenu}
              options={{
                title: "Debug menu",
              }}
            />,
          ].map((e) => cloneElement(e, { key: e.props.name }))
        : [],
    [],
  );
}
