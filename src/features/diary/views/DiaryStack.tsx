import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { OTPScreen, OTPScreenParams } from "@features/otp/screens";
import { EnterEmail } from "@features/otp/views/EnterEmail";
import { VerifyEmail } from "@features/otp/views/VerifyEmail";
import { ScanScreen, ScanScreenParams } from "@features/scan/screens";
import { VisitRecordedScreen } from "@features/scan/views/VisitRecordedScreen";
import { headerOptions } from "@navigation/options";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { DiaryScreen, DiaryScreenParams } from "../screens";
import { AddManualDiaryEntry } from "./AddManualDiaryEntry";
import { CopiedDiary } from "./CopiedDiary";
import { Diary } from "./Diary";
import { DiaryEntryScreen } from "./DiaryEntry";
import { EditDiaryEntryScreen } from "./EditDiaryEntry";
import { ViewDiary } from "./ViewDiary";

export type DiaryStackParamList = DiaryScreenParams &
  OTPScreenParams & {
    [TabScreen.Navigator]: undefined;
  } & Pick<ScanScreenParams, ScanScreen.Recorded>;

const Stack = createStackNavigator<DiaryStackParamList>();

export function DiaryStack() {
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
        name={DiaryScreen.Diary}
        options={{ title: t("screenTitles:diary") }}
        component={Diary}
      />
      <Stack.Screen
        name={DiaryScreen.DiaryEntry}
        options={{ title: t("screenTitles:diaryEntry") }}
        component={DiaryEntryScreen}
      />
      <Stack.Screen
        name={DiaryScreen.AddEntryManually}
        options={{
          title: t("screenTitles:addEntryManually"),
        }}
        component={AddManualDiaryEntry}
      />
      <Stack.Screen
        name={DiaryScreen.EditEntry}
        options={{ title: t("screenTitles:editDiary") }}
        component={EditDiaryEntryScreen}
      />
      <Stack.Screen
        name={OTPScreen.EnterEmail}
        component={EnterEmail}
        options={{
          title: t("screenTitles:enterEmail"),
        }}
      />
      <Stack.Screen
        name={OTPScreen.VerifyEmail}
        component={VerifyEmail}
        options={{
          title: t("screenTitles:verifyEmail"),
        }}
      />
      <Stack.Screen
        name={DiaryScreen.ViewDiary}
        component={ViewDiary}
        options={{
          title: t("screenTitles:viewDiary"),
        }}
      />
      <Stack.Screen
        name={DiaryScreen.CopiedDiary}
        component={CopiedDiary}
        options={{
          title: t("screenTitles:copiedDiary"),
        }}
      />
      <Stack.Screen
        name={ScanScreen.Recorded}
        options={{ title: t("screenTitles:recorded") }}
        component={VisitRecordedScreen}
      />
    </Stack.Navigator>
  );
}
