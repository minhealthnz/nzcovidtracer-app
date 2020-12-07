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
import { ENFScreen, ENFScreenParams } from "../screens";
import { ENFNotSupported } from "./ENFNotSupported";
import { ENFSettings } from "./ENFSettings";
import { ENFShare } from "./ENFShare";
import { ENFShareSuccess } from "./ENFShareSuccess";

export type ENFStackParamList = ENFScreenParams & MainStackParamList;

const Stack = createStackNavigator<ENFStackParamList>();

export function ENFNavigator() {
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
        name={ENFScreen.Settings}
        options={{ title: t("screenTitles:enfSettings") }}
        component={ENFSettings}
      />
      <Stack.Screen
        name={ENFScreen.Share}
        options={{ title: t("screenTitles:enfShare") }}
        component={ENFShare}
      />
      <Stack.Screen
        name={ENFScreen.ShareSuccess}
        options={{ title: t("screenTitles:enfShareSuccess") }}
        component={ENFShareSuccess}
      />
      <Stack.Screen
        name={ENFScreen.NotSupported}
        options={{ title: t("screenTitles:enfSettings") }}
        component={ENFNotSupported}
      />
    </Stack.Navigator>
  );
}
