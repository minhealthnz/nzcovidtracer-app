import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { headerOptions } from "@navigation/options";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { RequestCallbackScreen } from "../screens";
import RequestCallback from "./RequestCallback";
import RequestCallbackConfirm from "./RequestCallbackConfirm";

export type RequestCallbackParamList = {
  [RequestCallbackScreen.RequestCallback]: undefined;
  [RequestCallbackScreen.Confirm]: {
    firstName: string;
    lastName: string;
    phone: string;
    notes: string;
  };
  [TabScreen.Home]: undefined;
};

const Stack = createStackNavigator<RequestCallbackParamList>();

export default function RequestCallbackStack() {
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
        name={RequestCallbackScreen.RequestCallback}
        options={{ title: t("screenTitles:requestCallback") }}
        component={RequestCallback}
      />
      <Stack.Screen
        name={RequestCallbackScreen.Confirm}
        options={{ title: t("screenTitles:requestCallbackConfirm") }}
        component={RequestCallbackConfirm}
      />
    </Stack.Navigator>
  );
}
