import { HeaderBackButton } from "@components/atoms/HeaderBackButton";
import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { NHIScreen } from "../screens";

const assets = {
  tick: require("@assets/images/Tick.png"),
};

interface Props extends StackScreenProps<MainStackParamList, NHIScreen.Added> {}
export function NHIAdded(props: Props) {
  const { t } = useTranslation();

  const handleBackPress = useCallback(() => {
    props.navigation.popToTop();
    props.navigation.goBack();
  }, [props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={handleBackPress} />,
      headerRight: () => null,
    });
  }, [props.navigation, handleBackPress]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.tick}
      headerBackgroundColor={colors.green}
      heading={t("screens:addedNHI:title")}
      description={t("screens:addedNHI:description")}
      buttonText={t("screens:buttonNHI:finish")}
      onButtonPress={handleBackPress}
      buttonTestID="nhiAdded:done"
    />
  );
}
