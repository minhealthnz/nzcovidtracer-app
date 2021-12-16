import { DiaryShared } from "@features/diary/views/DiaryShared";
import { createStackNavigator } from "@react-navigation/stack";
import React, { cloneElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DiaryScreen, DiaryScreenParams } from "../screens";
import { AddManualDiaryEntry } from "../views/AddManualDiaryEntry";
import { CopiedDiary } from "../views/CopiedDiary";
import { Diary } from "../views/Diary";
import { DiaryEntryScreen } from "../views/DiaryEntry";
import { EditDiaryEntryScreen } from "../views/EditDiaryEntry";
import { ShareDiary } from "../views/ShareDiary";
import { ShareDiaryConfirm } from "../views/ShareDiaryConfirm";
import { ShareDiaryList } from "../views/ShareDiaryList";
import { ViewDiary } from "../views/ViewDiary";

const Stack = createStackNavigator<DiaryScreenParams>();

export function useDiaryScreens() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        <Stack.Screen
          name={DiaryScreen.Diary}
          options={{ title: t("screenTitles:diary") }}
          component={Diary}
        />,
        <Stack.Screen
          name={DiaryScreen.DiaryEntry}
          options={{ title: t("screenTitles:diaryEntry") }}
          component={DiaryEntryScreen}
        />,
        <Stack.Screen
          name={DiaryScreen.AddEntryManually}
          options={{
            title: t("screenTitles:addEntryManually"),
          }}
          component={AddManualDiaryEntry}
        />,
        <Stack.Screen
          name={DiaryScreen.EditEntry}
          options={{ title: t("screenTitles:editDiary") }}
          component={EditDiaryEntryScreen}
        />,
        <Stack.Screen
          name={DiaryScreen.ViewDiary}
          component={ViewDiary}
          options={{
            title: t("screenTitles:viewDiary"),
          }}
        />,
        <Stack.Screen
          name={DiaryScreen.CopiedDiary}
          component={CopiedDiary}
          options={{
            title: t("screenTitles:copiedDiary"),
          }}
        />,
        <Stack.Screen
          name={DiaryScreen.ShareDiary}
          options={{ title: t("screenTitles:diaryShared") }}
          component={ShareDiary}
        />,
        <Stack.Screen
          name={DiaryScreen.DiaryShared}
          options={{ title: t("screenTitles:diaryShared") }}
          component={DiaryShared}
        />,
        <Stack.Screen
          name={DiaryScreen.ShareDiaryList}
          options={{ title: t("screenTitles:diaryShared") }}
          component={ShareDiaryList}
        />,
        <Stack.Screen
          name={DiaryScreen.ShareDiaryConfirm}
          options={{ title: t("screenTitles:diaryShared") }}
          component={ShareDiaryConfirm}
        />,
      ].map((e) =>
        cloneElement(e, {
          key: e.props.name,
        }),
      ),
    [t],
  );
}
