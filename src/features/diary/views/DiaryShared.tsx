import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React, { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

const assets = {
  headerImage: require("@assets/images/Tick.png"),
};

export interface DiarySharedProps
  extends StackScreenProps<MainStackParamList, DiaryScreen.DiaryShared> {}

export function DiaryShared(props: DiarySharedProps) {
  const { t } = useTranslation();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => null,
    });
  }, [props.navigation]);

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
