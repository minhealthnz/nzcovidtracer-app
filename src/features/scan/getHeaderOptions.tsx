import { HeaderButton } from "@components/atoms/HeaderButton";
import { selectCurrentRouteName } from "@features/device/selectors";
import { DiaryScreen } from "@features/diary/screens";
import { AccessibleHeaderTitle } from "@navigation/hooks/AccessibleHeaderTitle";
import { useFocusView } from "@navigation/hooks/useFocusView";
import { useNavigation } from "@react-navigation/core";
import { StackHeaderTitleProps } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { ScanScreen } from "./screens";

export function getHeaderOptions() {
  return {
    headerLeft: () => <HeaderLeft />,
    headerRight: () => <HeaderRight />,
    headerTitle: (props: StackHeaderTitleProps) => <HeaderTitle {...props} />,
  };
}

function HeaderLeft() {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate(ScanScreen.TutorialNavigator);
  }, [navigation]);

  return (
    <HeaderButton
      text={t("screens:scan:guide")}
      onPress={handlePress}
      accessibilityLabel={t("screens:scan:accessibility:startTutorial")}
      style={styles.infoButton}
    />
  );
}

function HeaderRight() {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate(DiaryScreen.Diary);
  }, [navigation]);

  return (
    <HeaderButton
      text={t("screens:scan:diary")}
      onPress={handlePress}
      accessibilityLabel={t("screens:scan:accessibility:diaryHistory")}
      style={styles.historyButton}
    />
  );
}

function HeaderTitle(props: StackHeaderTitleProps) {
  const { t } = useTranslation();

  const currentRouteName = useSelector(selectCurrentRouteName);

  const { focusView, ref } = useFocusView();

  useEffect(() => {
    if (currentRouteName === TabScreen.RecordVisit) {
      focusView();
    }
  }, [currentRouteName, focusView]);

  return (
    <AccessibleHeaderTitle {...props} ref={ref}>
      {t("screenTitles:recordAVisit")}
    </AccessibleHeaderTitle>
  );
}

const styles = StyleSheet.create({
  historyButton: {
    paddingRight: 20,
  },
  infoButton: {
    paddingLeft: 20,
  },
});
