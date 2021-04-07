import { Text } from "@components/atoms";
import { FormV2 } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { setFinishedCopyDiary } from "@features/onboarding/reducer";
import { createOTPSession } from "@features/otp/reducer";
import { OTPScreen } from "@features/otp/screens";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid } from "@reduxjs/toolkit";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { DiaryScreen } from "../screens";

const assets = {
  tick: require("@assets/images/Tick.png"),
};

const Description = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  margin-bottom: ${grid2x}px;
`;

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.CopiedDiary> {}

export function CopiedDiary(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { email, isOnboarding } = props.route.params;

  const onSubmitPress = useCallback(() => {
    if (isOnboarding) {
      dispatch(setFinishedCopyDiary());
    } else {
      props.navigation.navigate(TabScreen.Navigator);
    }
  }, [props.navigation, dispatch, isOnboarding]);

  const onCopyAnotherPress = useCallback(() => {
    const sessionId = nanoid();
    dispatch(
      createOTPSession({
        id: sessionId,
        type: isOnboarding ? "viewDiaryOnboarding" : "viewDiary",
        mfaErrorHandling: "ignore",
      }),
    );
    props.navigation.navigate(OTPScreen.EnterEmail, {
      sessionId,
    });
  }, [props.navigation, dispatch, isOnboarding]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.tick}
      headerBackgroundColor={colors.green}
      heading={t("screens:copiedDiary:title")}
      buttonText={t("screens:copiedDiary:submit")}
      buttonTestID={"copiedDiary:submit"}
      onButtonPress={onSubmitPress}
      secondaryButtonText={t("screens:copiedDiary:copyAnother")}
      onSecondaryButtonPress={onCopyAnotherPress}
    >
      <Description>
        {t("screens:copiedDiary:descriptionP1")}
        <Text style={{ fontFamily: fontFamilies["open-sans-bold"] }}>
          {email}
        </Text>
      </Description>
      <Description>{t("screens:copiedDiary:descriptionP2")}</Description>
    </FormV2>
  );
}
