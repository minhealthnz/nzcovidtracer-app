import { HeaderCloseButton } from "@components/atoms/HeaderCloseButton";
import { FormV2 } from "@components/molecules/FormV2";
import { commonStyles } from "@lib/commonStyles";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { OnboardingScreen } from "../screens";
import { LockCodeNavigatorParamList } from "./LockCodeNavigator";

export interface LockCodeProps
  extends StackScreenProps<
    LockCodeNavigatorParamList,
    OnboardingScreen.LockCode
  > {}

export function LockCode(props: LockCodeProps) {
  const { t } = useTranslation();

  const handleDonePress = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderCloseButton testID="lockCode.close" onPress={handleDonePress} />
      ),
      headerLeft: () => null,
    });
  }, [props.navigation, handleDonePress]);

  useAccessibleTitle();

  return (
    <FormV2
      snapButtonsToBottom={true}
      headerImage={require("../assets/images/lock-code.png")}
      headerImageStyle={commonStyles.headerImage}
      headerImageAccessibilityLabel={t("screens:lockCode:headerImageLabel")}
      heading={t("screens:lockCode:heading")}
      headingStyle={commonStyles.headingBig}
      description={t("screens:lockCode:description")}
      buttonText={t("screens:lockCode:okay")}
      onButtonPress={handleDonePress}
    />
  );
}
