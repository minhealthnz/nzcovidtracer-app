import { HeaderCloseButton } from "@components/atoms/HeaderCloseButton";
import { FormV2 } from "@components/molecules/FormV2";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { OnboardingScreen } from "../screens";
import { styles } from "../styles";
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
      headerImage={require("../assets/images/lock-code.png")}
      heading={t("screens:lockCode:heading")}
      headingStyle={styles.headingBig}
      description={t("screens:lockCode:description")}
      buttonText={t("screens:lockCode:okay")}
      onButtonPress={handleDonePress}
    />
  );
}
