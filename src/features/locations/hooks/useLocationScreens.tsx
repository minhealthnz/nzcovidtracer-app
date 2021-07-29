import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LocationScreen, LocationScreenParams } from "../screens";
import { PickSavedLocation } from "../views/PickSavedLocation";
import { PlaceOrActivity } from "../views/PlaceOrActivity";
import { SavedLocations } from "../views/SavedLocations";
import { SaveLocationOnboarding } from "../views/SaveLocationOnboarding";
import { SaveNewLocation } from "../views/SaveNewLocation";
import { SaveNewLocationEmpty } from "../views/SaveNewLocationEmpty";

const Stack = createStackNavigator<LocationScreenParams>();

export function useLocationScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={LocationScreen.SaveLocationOnboarding}
          options={{ title: t("screenTitles:savingLocations") }}
          component={SaveLocationOnboarding}
        />,
        <Stack.Screen
          name={LocationScreen.SavedLocations}
          options={{
            title: t("screenTitles:savedLocations"),
          }}
          component={SavedLocations}
        />,
        <Stack.Screen
          name={LocationScreen.SaveNewLocation}
          options={{
            title: t("screenTitles:saveNewLocation"),
          }}
          component={SaveNewLocation}
        />,
        <Stack.Screen
          name={LocationScreen.SaveNewLocationEmpty}
          options={{
            title: t("screenTitles:saveNewLocation"),
          }}
          component={SaveNewLocationEmpty}
        />,
        <Stack.Screen
          name={LocationScreen.PlaceOrActivity}
          options={{
            title: t("screenTitles:placeOrActivity"),
          }}
          component={PlaceOrActivity}
        />,
        <Stack.Screen
          name={LocationScreen.PickSavedLocation}
          options={{
            title: t("screenTitles:pickSavedLocation"),
          }}
          component={PickSavedLocation}
        />,
      ].map((e) => cloneElement(e, { key: e.props.name })),
    [t],
  );
}
