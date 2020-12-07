import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { OnboardingScreen } from "../screens";
import { styles } from "../styles";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

export interface ThanksProps
  extends StackScreenProps<OnboardingStackParamList, OnboardingScreen.Thanks> {}

export function Thanks(props: ThanksProps) {
  const handleButtonPress = () => {
    navigateNext();
  };
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.RegistrationComplete);
    }, []),
  );

  useAccessibleTitle();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => null,
    });
  }, [props.navigation]);

  const { navigateNext } = useOnboardingFlow(props, OnboardingScreen.Thanks);

  return (
    <FormV2
      heading={t("screens:thanks:heading")}
      headingStyle={styles.headingBig}
      description={t("screens:thanks:description")}
      headerImage={require("../assets/images/be-kind.png")}
      headerBackgroundColor={colors.lightBlue}
      buttonText={t("screens:thanks:finish")}
      onButtonPress={handleButtonPress}
    />
  );
}
