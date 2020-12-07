import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { DiaryScreen } from "@features/diary/screens";
import { headerOptions } from "@navigation/options";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { ScanScreen, ScanScreenParams } from "../screens";
import { ScanNotRecorded } from "./ScanNotRecorded";
import { VisitRecordedScreen } from "./VisitRecordedScreen";

export type ScanStackParamList = ScanScreenParams &
  MainStackParamList & {
    [DiaryScreen.Diary]: undefined;
    [DiaryScreen.DiaryEntry]: { id: string };
    [DiaryScreen.AddEntryManually]: undefined;

    [DiaryScreen.EditEntry]: { id: string };
    [TabScreen.RecordVisit]: undefined;
  };

const Stack = createStackNavigator<ScanStackParamList>();

export function ScanNavigator() {
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
        name={ScanScreen.Recorded}
        options={{ title: t("screenTitles:recorded") }}
        component={VisitRecordedScreen}
      />
      <Stack.Screen
        name={ScanScreen.ScanNotRecorded}
        options={{ title: t("screenTitles:scanNotRecorded") }}
        component={ScanNotRecorded}
      />
    </Stack.Navigator>
  );
}
