import { Text, VerticalSpacing } from "@components/atoms";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import {
  aboutBluetoothLink,
  colors,
  fontFamilies,
  fontSizes,
  grid,
} from "@constants";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import { isIOS } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import {
  AuthorisedStatus,
  useExposure,
} from "react-native-exposure-notification-service";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { enableBluetooth } from "../reducer";

const Subtext = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  margin-top: ${grid}px;
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

const BluetoothDialogLink = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  text-decoration: underline;
  font-size: ${fontSizes.large}px;
  margin-top: 10px;
`;

const assets = {
  enabled: require("../assets/icons/enabled.png"),
  disabled: require("../assets/icons/disabled.png"),
  warning: require("../assets/icons/warning.png"),
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
    status,
    permissions,
  } = useExposure();

  const dispatch = useDispatch();

  const bluetoothDisabled = useSelector(selectBluetoothEnfDisabled);

  const blockedFromShowingPrompt =
    isIOS &&
    (isAuthorised === AuthorisedStatus.blocked ||
      //@ts-ignore
      (status.type?.includes("unauthorized") &&
        permissions.exposure.status === "allowed"));

  const formRef = useRef<FormV2Handle | null>(null);

  const {
    bannerText,
    bannerTextColor,
    bannerColor,
    bannerIcon,
  } = useMemo(() => {
    if (enabled && bluetoothDisabled) {
      return {
        bannerText: t("screens:enfSettings:bannerInactive"),
        bannerTextColor: colors.primaryBlack,
        bannerColor: colors.carrot,
        bannerIcon: assets.warning,
      };
    } else if (enabled) {
      return {
        bannerText: t("screens:enfSettings:bannerEnabled"),
        bannerTextColor: colors.primaryBlack,
        bannerColor: colors.green,
        bannerIcon: assets.enabled,
      };
    } else {
      return {
        bannerText: t("screens:enfSettings:bannerDisabled"),
        bannerTextColor: colors.white,
        bannerColor: colors.red,
        bannerIcon: assets.disabled,
      };
    }
  }, [enabled, bluetoothDisabled, t]);

  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    formRef.current?.accessibilityFocusOnBanner();
  }, [enabled]);

  const handleBluetoothOn = useCallback(() => {
    dispatch(enableBluetooth());
  }, [dispatch]);

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
          ? bluetoothDisabled
            ? t("screens:enfSettings:bannerInactiveAccessibilityLabel")
            : t("screens:enfSettings:bannerEnabledAccessibilityLabel")
          : t("screens:enfSettings:bannerDisabledAccessibilityLabel")
      }
    >
      <Tip
        backgroundColor={colors.lightYellow}
        heading={t("screens:enfSettings:subheading")}
      >
        <TipText>{t("screens:enfSettings:bluetoothMessage")}</TipText>
        {enabled && bluetoothDisabled && (
          <>
            <VerticalSpacing height={3} />
            <BluetoothDialogLink
              onPress={handleBluetoothOn}
              accessibilityLabel={
                isIOS
                  ? t("screens:enfSettings:bluetoothMessageTurnOnIOS")
                  : t("screens:enfSettings:bluetoothMessageTurnOn")
              }
              accessibilityHint={
                isIOS
                  ? t("screens:enfSettings:bluetoothMessageTurnOnIOSHint")
                  : ""
              }
              accessibilityRole={"button"}
            >
              {isIOS
                ? t("screens:enfSettings:bluetoothMessageTurnOnIOS")
                : t("screens:enfSettings:bluetoothMessageTurnOn")}
            </BluetoothDialogLink>
            <VerticalSpacing height={5} />
          </>
        )}
      </Tip>
      <VerticalSpacing height={12} />
      <Subtext>{t("screens:enfSettings:subtext")}</Subtext>
      <Subtext>{t("screens:enfSettings:subtextP2")}</Subtext>
      <Subtext>{t("screens:enfSettings:subtextP3")}</Subtext>
    </FormV2>
  );
}
