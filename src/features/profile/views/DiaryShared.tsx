import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { ProfileStackParamList } from "@features/profile/views/ProfileNavigator";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React from "react";
import { useTranslation } from "react-i18next";

import { ProfileScreen } from "../screens";

const assets = {
  headerImage: require("@assets/images/Tick.png"),
};

export interface DiarySharedProps
  extends StackScreenProps<ProfileStackParamList, ProfileScreen.DiaryShared> {}

export function DiaryShared(props: DiarySharedProps) {
  const { t } = useTranslation();

  const onDonePress = () => {
    props.navigation.popToTop();
    props.navigation.navigate(TabScreen.MyData);
  };

  useAccessibleTitle();

  return (
    <FormV2
      heading={t("screens:diaryShared:title")}
      description={t("screens:diaryShared:description")}
      headerImage={assets.headerImage}
      headerBackgroundColor={colors.green}
      buttonTestID="diaryShared:done"
      onButtonPress={onDonePress}
      buttonText={t("screens:diaryShared:done")}
    />
  );
}
