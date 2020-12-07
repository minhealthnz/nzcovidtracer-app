import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import config from "../../../config";
import { Link } from "../components/Link";
import { ScanScreen } from "../screens";
import { ScanStackParamList } from "./ScanNavigator";

export interface ScanNotRecordedProps
  extends StackScreenProps<ScanStackParamList, ScanScreen.ScanNotRecorded> {}

export function ScanNotRecorded({ navigation }: ScanNotRecordedProps) {
  const { t } = useTranslation();
  const handleBackPressed = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const handlePhonePressed = useCallback(() => {
    Linking.openURL(config.SupportPhoneLink);
  }, []);
  const handleEmailPressed = useCallback(() => {
    Linking.openURL(config.FeedbackEmailLink);
  }, []);

  useAccessibleTitle();

  return (
    <FormV2
      headerBackgroundColor={colors.toastRed}
      headerImage={require("@assets/images/error-large.png")}
      heading={t("screens:scanNotRecorded:heading")}
      description={t("screens:scanNotRecorded:description")}
      buttonText={t("screens:scanNotRecorded:goBack")}
      onButtonPress={handleBackPressed}
    >
      <Link
        text={t("screens:scanNotRecorded:links:phone")}
        onPress={handlePhonePressed}
      />
      <Link
        text={t("screens:scanNotRecorded:links:email")}
        onPress={handleEmailPressed}
      />
    </FormV2>
  );
}
