import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { ENFScreen } from "../screens";
import { ENFStackParamList } from "./ENFNavigator";

const assets = {
  tick: require("@assets/images/Tick.png"),
};

interface Props
  extends StackScreenProps<ENFStackParamList, ENFScreen.ShareSuccess> {}

export function ENFShareSuccess(props: Props) {
  const { t } = useTranslation();

  const { navigation } = props;

  const onFinishPress = useCallback(() => {
    navigation.navigate(TabScreen.Navigator, {
      screen: TabScreen.MyData,
    });
  }, [navigation]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.tick}
      headerBackgroundColor={colors.green}
      heading={t("screens:enfShareSuccess:title")}
      description={t("screens:enfShareSuccess:description")}
      buttonText={t("screens:enfShareSuccess:button")}
      buttonAccessibilityHint={t(
        "screens:enfShareSuccess:buttonAccessibilityHint",
      )}
      onButtonPress={onFinishPress}
    />
  );
}
