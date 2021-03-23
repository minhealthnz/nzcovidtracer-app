import { Text } from "@components/atoms";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import {
  aboutBluetoothLink,
  colors,
  fontFamilies,
  fontSizes,
} from "@constants";
import { isIOS } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import {
  AuthorisedStatus,
  useExposure,
} from "react-native-exposure-notification-service";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { Subtext } from "../components/Subtext";

const Subheading = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

const assets = {
  enabled: require("../assets/icons/enabled.png"),
  disabled: require("../assets/icons/disabled.png"),
};

const { logInfo, logError } = createLogger("EnableENFDashboard");

export function ENFSettings() {
  const { t } = useTranslation();

  const {
    enabled,
    isAuthorised,
    authoriseExposure,
    start,
    stop,
    readPermissions,
  } = useExposure();

  const blockedFromShowingPrompt =
    isIOS && isAuthorised === AuthorisedStatus.blocked;

  const formRef = useRef<FormV2Handle | null>(null);

  const bannerText = enabled
    ? t("screens:enfSettings:bannerEnabled")
    : t("screens:enfSettings:bannerDisabled");
  const bannerTextColor = enabled ? colors.primaryBlack : colors.white;
  const bannerColor = enabled ? colors.green : colors.red;
  const bannerIcon = enabled ? assets.enabled : assets.disabled;

  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    formRef.current?.accessibilityFocusOnBanner();
  }, [enabled]);

  const onButtonPress = useCallback(async () => {
    if (blockedFromShowingPrompt) {
      Linking.openSettings();
    } else if (!enabled) {
      recordAnalyticEvent(AnalyticsEvent.ENFEnableButtonPressed);
      try {
        await authoriseExposure();
        const started = await start();
        await readPermissions();
        if (started) {
          recordAnalyticEvent(AnalyticsEvent.ENFEnableSuccess);
        }

        logInfo("Exposure service started? " + started);
      } catch (error) {
        logInfo("Could not invoke authoriseExposure", error);
      }
    } else {
      recordAnalyticEvent(AnalyticsEvent.ENFDisableButtonPressed);
      Alert.alert(
        t("screens:enfSettings:disableModal:title"),
        t("screens:enfSettings:disableModal:description"),
        [
          {
            text: t("screens:enfSettings:disableModal:cancel"),
            style: "cancel",
          },
          {
            text: t("screens:enfSettings:disableModal:turnOff"),
            onPress: () => {
              try {
                recordAnalyticEvent(AnalyticsEvent.ENFDisableModalPressed);
                stop();
              } catch (error) {
                logError("Failed to disable ENF.", error);
              }
            },
          },
        ],
      );
    }
  }, [
    enabled,
    authoriseExposure,
    start,
    stop,
    blockedFromShowingPrompt,
    t,
    readPermissions,
  ]);

  const onFindOutMorePress = () => {
    Linking.openURL(aboutBluetoothLink);
  };

  let buttonText: string;
  let buttonAccessibilityLabel: string;

  if (blockedFromShowingPrompt) {
    buttonText = t("screens:enfSettings:buttonBlocked");
    buttonAccessibilityLabel = t(
      "screens:enfSettings:buttonBlockedAccessibility",
    );
  } else if (enabled) {
    buttonText = t("screens:enfSettings:buttonEnabled");
    buttonAccessibilityLabel = t(
      "screens:enfSettings:buttonEnabledAccessibility",
    );
  } else {
    buttonText = t("screens:enfSettings:buttonDisabled");
    buttonAccessibilityLabel = t(
      "screens:enfSettings:buttonDisabledAccessibility",
    );
  }

  useAccessibleTitle();

  return (
    <FormV2
      ref={formRef}
      headerImage={require("../assets/images/information.png")}
      heading={t("screens:enfSettings:title")}
      description={t("screens:enfSettings:description")}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      buttonAccessibilityLabel={buttonAccessibilityLabel}
      secondaryButtonText={t("screens:enfSettings:secondaryButton")}
      accessibilitySecondaryLabel={t(
        "screens:enfSettings:secondaryButtonAccessibilityLabel",
      )}
      accessibilitySecondaryHint={t(
        "screens:enfSettings:secondaryButtonAccessibilityHint",
      )}
      onSecondaryButtonPress={onFindOutMorePress}
      bannerText={bannerText}
      bannerColor={bannerColor}
      bannerTextColor={bannerTextColor}
      bannerIcon={bannerIcon}
      bannerAccessibilityLabel={
        enabled
          ? t("screens:enfSettings:bannerEnabledAccessibilityLabel")
          : t("screens:enfSettings:bannerDisabledAccessibilityLabel")
      }
    >
      <Subheading>{t("screens:enfSettings:subheading")}</Subheading>
      <Subtext>{t("screens:enfSettings:subtext")}</Subtext>
      <Subtext>{t("screens:enfSettings:subtextP2")}</Subtext>
      <Subtext>{t("screens:enfSettings:subtextP3")}</Subtext>
    </FormV2>
  );
}
