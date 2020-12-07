import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import { DebugScreen } from "@features/debugging/screens";
import { Diary } from "@features/diary/views/Diary";
import { DiaryEntryScreen } from "@features/diary/views/DiaryEntry";
import { EditDiaryEntryScreen } from "@features/diary/views/EditDiaryEntry";
import { ShareDiary } from "@features/diary/views/ShareDiary";
import { NHIScreen } from "@features/nhi/screens";
import { DiaryShared } from "@features/profile/views/DiaryShared";
import { headerOptions } from "@navigation/options";
import { TransitionPresets } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { disableAnimations } from "../../../config";
import { ProfileScreen } from "../screens";

export type ProfileStackParamList = {
  [ProfileScreen.ShareDiary]: undefined;
  [ProfileScreen.DiaryShared]: undefined;
  [ProfileScreen.Diary]: undefined;
  [ProfileScreen.EditDiary]: { id: string };
  [ProfileScreen.DiaryEntry]: { id: string };
  [DebugScreen.Navigator]: undefined;
  [TabScreen.MyData]: undefined;
  [NHIScreen.Navigator]: undefined;
} & MainStackParamList;

const Stack = createStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
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
        name={ProfileScreen.ShareDiary}
        options={{ title: t("screenTitles:shareDiary") }}
        component={ShareDiary}
      />
      <Stack.Screen
        name={ProfileScreen.DiaryShared}
        options={{ title: t("screenTitles:diaryShared") }}
        component={DiaryShared}
      />
      <Stack.Screen
        name={ProfileScreen.Diary}
        options={{ title: t("screenTitles:diary") }}
        component={Diary}
      />
      <Stack.Screen
        name={ProfileScreen.EditDiary}
        options={{ title: t("screenTitles:editDiary") }}
        component={EditDiaryEntryScreen}
      />
      <Stack.Screen
        name={ProfileScreen.DiaryEntry}
        options={{ title: t("screenTitles:diaryEntry") }}
        component={DiaryEntryScreen}
      />
    </Stack.Navigator>
  );
}
