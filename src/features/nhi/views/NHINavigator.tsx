import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { headerOptions } from "@navigation/options";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { NHIScreen, NHIScreenParams } from "../screens";
import { NHIAdd } from "./NHIAdd";
import { NHIAdded } from "./NHIAdded";
import Privacy from "./NHIPrivacy";
import { NHIView } from "./NHIView";

export type NHIStackParamList = NHIScreenParams & MainStackParamList;

const Stack = createStackNavigator<NHIStackParamList>();

export function NHINavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
        animationEnabled: !disableAnimations,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name={NHIScreen.Privacy}
        options={{ title: t("screenTitles:addNHI") }}
        component={Privacy}
      />
      <Stack.Screen
        name={NHIScreen.Add}
        options={{ title: t("screenTitles:addNHI") }}
        component={NHIAdd}
      />
      <Stack.Screen
        name={NHIScreen.Added}
        options={{ title: t("screenTitles:nhiAdded") }}
        component={NHIAdded}
      />
      <Stack.Screen
        name={NHIScreen.View}
        options={{ title: t("screenTitles:nhiView") }}
        component={NHIView}
      />
    </Stack.Navigator>
  );
}
