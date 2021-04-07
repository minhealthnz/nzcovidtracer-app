import ImageButton from "@components/atoms/ImageButton";
import { DiaryScreen } from "@features/diary/screens";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TFunction } from "i18next";
import React from "react";
import styled from "styled-components/native";

import { ScanScreen } from "./screens";

const HistoryButton = styled(ImageButton)`
  width: 60px;
  height: 60px;
`;

const InfoButton = styled(ImageButton)`
  width: 60px;
  height: 60px;
`;

const assets = {
  history: require("@assets/icons/diary.png"),
  info: require("@assets/icons/info.png"),
};

export function getHeaderOptions(
  navigation: StackNavigationProp<MainStackParamList>,
  t: TFunction,
) {
  const handleGoToHistory = () => {
    navigation.navigate(DiaryScreen.Diary);
  };
  const handleInfoPress = () => {
    navigation.navigate(ScanScreen.TutorialNavigator);
  };

  return {
    headerLeft: () => (
      <HistoryButton
        image={assets.history}
        onPress={handleGoToHistory}
        testID="goToHistory"
        accessibilityLabel={t("accessibility:button:diaryHistory")}
      />
    ),
    headerRight: () => (
      <InfoButton
        image={assets.info}
        onPress={handleInfoPress}
        testID="goToTutorial"
        accessibilityLabel={t("accessibility:button:startTutorial")}
      />
    ),
  };
}
