import { setCurrentRouteName } from "@features/device/reducer";
import { NavigationContainer as BaseNavigationContainer } from "@react-navigation/native";
import { AnyScreen } from "@views/screens";
import { ReactNode, useCallback } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import { linking } from "./linking";
import { ManualLinks } from "./ManualLinks";
import { navigationRef } from "./navigation";

export interface NavigationContainerProps {
  children: ReactNode;
}

export function NavigationContainer({ children }: NavigationContainerProps) {
  const dispatch = useDispatch();

  const handleNavigationStateChange = useCallback(() => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRouteName) {
      dispatch(setCurrentRouteName(currentRouteName as AnyScreen));
    }
  }, [dispatch]);

  return (
    <BaseNavigationContainer
      ref={navigationRef}
      onReady={handleNavigationStateChange}
      onStateChange={handleNavigationStateChange}
      linking={linking}
    >
      <ManualLinks />
      {children}
    </BaseNavigationContainer>
  );
}
