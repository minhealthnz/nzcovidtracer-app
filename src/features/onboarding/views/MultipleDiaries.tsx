import { FormV2 } from "@components/molecules/FormV2";
import { createOTPSession } from "@features/otp/reducer";
import { OTPScreen } from "@features/otp/screens";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { setStartedCopyDiary } from "../reducer";
import { OnboardingScreen } from "../screens";
import { styles } from "../styles";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

const assets = {
  diary: require("../assets/images/diary.png"),
};

export interface MultipleDiariesProps
  extends StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.MultipleDiaries
  > {}

export function MultipleDiaries(props: MultipleDiariesProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigateNext } = useOnboardingFlow(
    props,
    OnboardingScreen.MultipleDiaries,
  );
  const handleLaterPress = useCallback(() => {
    navigateNext();
  }, [navigateNext]);

  const handlePress = useCallback(() => {
    dispatch(setStartedCopyDiary());
    const sessionId = nanoid();
    dispatch(
      createOTPSession({
        id: sessionId,
        type: "viewDiaryOnboarding",
        verifyEmailScreenTitle: t("screenTitles:chooseOldDiary"),
        enterEmailScreenTitle: t("screenTitles:chooseOldDiary"),
        mfaErrorHandling: "ignore",
      }),
    );
    props.navigation.navigate(OTPScreen.EnterEmail, {
      sessionId,
    });
  }, [dispatch, props.navigation, t]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.diary}
      heading={t("screens:multipleDiaries:title")}
      headingStyle={styles.headingBig}
      description={t("screens:multipleDiaries:description")}
      buttonText={t("screens:multipleDiaries:okay")}
      onButtonPress={handlePress}
      secondaryButtonText={t("screens:multipleDiaries:later")}
      onSecondaryButtonPress={handleLaterPress}
    />
  );
}
