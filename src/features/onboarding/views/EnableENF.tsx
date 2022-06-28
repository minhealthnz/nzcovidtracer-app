import { Button, Text, VerticalSpacing } from "@components/atoms";
import { HeaderCloseButton } from "@components/atoms/HeaderCloseButton";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import {
  aboutBluetoothLink,
  colors,
  fontFamilies,
  fontSizes,
  grid2x,
} from "@constants";
import { ENFEvent } from "@features/enfExposure/events";
import { commonStyles } from "@lib/commonStyles";
import { isIOS } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import {
  AuthorisedStatus,
  useExposure,
} from "react-native-exposure-notification-service";
import styled from "styled-components";

import { recordAnalyticEvent } from "../../../analytics";
import { OnboardingScreen } from "../screens";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

interface Props
  extends StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.EnableENF
  > {}

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

const { logInfo } = createLogger("EnableENFOnboarding");

export function EnableENF(props: Props) {
  const { t } = useTranslation();

  const { enabled, authoriseExposure, isAuthorised, readPermissions } =
    useExposure();
  const { navigateNext } = useOnboardingFlow(props, OnboardingScreen.EnableENF);
  const formRef = useRef<FormV2Handle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isModal } = props.route.params || {};

  const handleClose = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  useLayoutEffect(() => {
    if (isModal) {
      props.navigation.setOptions({
        headerRight: () => (
          <HeaderCloseButton testID="enableENF.close" onPress={handleClose} />
        ),
        headerLeft: () => null,
      });
    }
  }, [props.navigation, isModal, handleClose]);

  const blockedFromShowingPrompt =
    isIOS && isAuthorised === AuthorisedStatus.blocked;

  const handleNext = useCallback(() => {
    setIsLoading(false);
    if (isModal) {
      handleClose();
    } else {
      navigateNext();
    }
  }, [setIsLoading, navigateNext, isModal, handleClose]);

  const handleButtonPress = useCallback(async () => {
    if (blockedFromShowingPrompt) {
      Linking.openSettings();
      handleNext();
      return;
    }
    if (enabled) {
      handleNext();
      return;
    }
    setIsLoading(true);
    logInfo("Exposure service requested");

    try {
      const authorised = await authoriseExposure();
      if (authorised) {
        recordAnalyticEvent(ENFEvent.ENFOnboardingEnableSuccess);
      }
      await readPermissions();

      logInfo("Attempt to authoriseExposure" + authorised);
      handleNext();
    } catch (error) {
      logInfo("Exposure service error", error);
      handleNext();
    }
  }, [
    enabled,
    authoriseExposure,
    handleNext,
    blockedFromShowingPrompt,
    readPermissions,
  ]);

  const renderButton = useCallback(() => {
    let text: string;
    let accessibilityLabel: string;

    if (blockedFromShowingPrompt) {
      text = t("screens:enableENF:settings");
      accessibilityLabel = t("screens:enableENF:settingsAccessibility");
    } else if (enabled) {
      text = t("screens:enableENF:done");
      accessibilityLabel = t("screens:enableENF:doneAccessibility");
    } else {
      text = t("screens:enableENF:enableTracing");
      accessibilityLabel = t("screens:enableENF:enableTracingAccessibility");
    }

    return (
      <Button
        text={text}
        accessibilityLabel={accessibilityLabel}
        buttonColor={enabled ? "green" : "black"}
        isLoading={isLoading}
        onPress={handleButtonPress}
      />
    );
  }, [enabled, isLoading, handleButtonPress, t, blockedFromShowingPrompt]);

  useAccessibleTitle();

  const handleLinkPressed = () => {
    Linking.openURL(aboutBluetoothLink);
  };

  return (
    <FormV2
      headerImage={require("../assets/images/bluetooth.png")}
      heading={t("screens:enableENF:heading")}
      headerImageAccessibilityLabel={t(
        "screens:enableENF:headerImageAccessibilityLabel",
      )}
      headerBackgroundColor={colors.lightGrey}
      headerImageStyle={commonStyles.headerImage}
      headingStyle={commonStyles.headingBig}
      renderButton={renderButton}
      ref={formRef}
      snapButtonsToBottom={true}
    >
      <Paragraph>{t("screens:enableENF:description1")}</Paragraph>
      <VerticalSpacing height={grid2x} />
      <Paragraph>{t("screens:enableENF:description2")}</Paragraph>
      <VerticalSpacing height={grid2x} />
      <Paragraph>{t("screens:enableENF:description3")}</Paragraph>
      <VerticalSpacing height={grid2x} />
      <Paragraph>{t("screens:enableENF:description4")}</Paragraph>
      <VerticalSpacing height={grid2x} />
      <Link
        onPress={handleLinkPressed}
        accessibilityLabel={t("screens:enableENF:moreAccessibility")}
        accessibilityHint={t("screens:enableENF:moreAccessibilityHint")}
        accessibilityRole="button"
      >
        {t("screens:enableENF:more")}
      </Link>
    </FormV2>
  );
}
