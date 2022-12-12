import { Text, VerticalSpacing } from "@components/atoms";
import { BulletItem } from "@components/atoms/BulletItem";
import { FormV2 } from "@components/molecules/FormV2";
import { fontFamilies, fontSizes, grid, grid2x, privacyLink } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { OnboardingScreen } from "../screens";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

const Heading1 = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: 30px;
  line-height: 36px;
  margin-vertical: ${grid}px;
`;

const Heading2 = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

const Paragraph = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

const Link = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  text-decoration-line: underline;
`;

export function PrivacyStatement(
  props: StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.PrivacyStatement
  >,
) {
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.RegistrationLegal);
    }, []),
  );

  const { navigateNext } = useOnboardingFlow(
    props,
    OnboardingScreen.PrivacyStatement,
  );

  const handleButtonPrimaryPress = () => {
    navigateNext();
  };

  const handleLinkPressed = () => {
    Linking.openURL(privacyLink);
  };

  useAccessibleTitle();

  return (
    <FormV2
      buttonText={t("screens:privacyStatement:buttonPrimary")}
      onButtonPress={handleButtonPrimaryPress}
      snapButtonsToBottom={true}
    >
      <Heading1>{t("screens:privacyStatement:title")}</Heading1>
      <Heading2>{t("screens:privacyStatement:section1:title")}</Heading2>
      <VerticalSpacing height={grid} />
      <Paragraph>{t("screens:privacyStatement:section1:copy")}</Paragraph>
      <VerticalSpacing height={grid2x} />

      <BulletItem>
        <Heading2>{t("screens:privacyStatement:section2:title")}</Heading2>
        <Paragraph>{t("screens:privacyStatement:section2:copy")}</Paragraph>
      </BulletItem>
      <BulletItem>
        <Heading2>{t("screens:privacyStatement:section4:title")}</Heading2>
        <Paragraph>{t("screens:privacyStatement:section4:copy")}</Paragraph>
      </BulletItem>
      <BulletItem>
        <Heading2>{t("screens:privacyStatement:section5:title")}</Heading2>
        <Paragraph>{t("screens:privacyStatement:section5:copy")}</Paragraph>
      </BulletItem>

      <Paragraph>{t("screens:privacyStatement:section6:copy1")}</Paragraph>
      <Paragraph>{t("screens:privacyStatement:section6:copy2")}</Paragraph>
      <VerticalSpacing height={grid2x} />
      <Heading2>{t("screens:privacyStatement:section7:title")}</Heading2>
      <Paragraph>{t("screens:privacyStatement:section7:copy")}</Paragraph>
      <VerticalSpacing height={grid} />
      <Paragraph
        accessible={true}
        accessibilityLabel={t("screens:privacyStatement:section7:link")}
        accessibilityRole="button"
        accessibilityHint={t(
          "screens:privacyStatement:section7:linkAccessibilityHint",
        )}
      >
        <Link onPress={handleLinkPressed}>
          {t("screens:privacyStatement:section7:link")}
        </Link>
      </Paragraph>
      <VerticalSpacing height={grid2x} />
    </FormV2>
  );
}
