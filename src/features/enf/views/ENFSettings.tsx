import { Text, VerticalSpacing } from "@components/atoms";
import { OrderedListItem } from "@components/atoms/OrderedListItem";
import { SecondaryButton } from "@components/atoms/SecondaryButton";
import { presets, Tip, TipSubHeading, TipText } from "@components/atoms/Tip";
import {
  Description,
  FormV2,
  FormV2Handle,
  Heading,
} from "@components/molecules/FormV2";
import {
  aboutBluetoothLink,
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
} from "@constants";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import { commonStyles } from "@lib/commonStyles";
import { isIOS } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
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
import { ENFScreen } from "../screens";

const SubHeading = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  padding-top: ${grid2x}px;
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

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

const CovidSafe = styled.Image`
  width: 165px;
  height: 42px;
`;

const ImageContainer = styled.View`
  padding: 5px 0 5px 0;
`;

const BluetoothTipContainer = styled.View`
  margin: -24px -24px 0 -24px;
  padding-bottom: 19px;
`;

const assets = {
  enabled: require("../assets/icons/enabled.png"),
  disabled: require("../assets/icons/disabled.png"),
  warning: require("../assets/icons/warning.png"),
  covidSafe: require("../assets/images/covid-safe.png"),
};

const { logInfo, logError } = createLogger("EnableENFDashboard");

interface Props
  extends StackScreenProps<MainStackParamList, ENFScreen.Settings> {}

export function ENFSettings(props: Props) {
  const { t } = useTranslation();

  const retryPassed = props.route.params?.retryPassed;

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

  const { bannerText, bannerTextColor, bannerColor, bannerIcon } =
    useMemo(() => {
      if (enabled && bluetoothDisabled) {
        return {
          bannerText: t("screens:enfSettings:bannerInactive"),
          bannerTextColor: colors.primaryBlack,
          bannerColor: colors.orange,
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
          bannerColor: colors.failure,
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

  const onFindOutMorePress = useCallback(() => {
    Linking.openURL(aboutBluetoothLink);
  }, []);

  let buttonText: string;
  let buttonAccessibilityLabel: string;

  if (!retryPassed && blockedFromShowingPrompt) {
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
    buttonText = retryPassed
      ? t("screens:enfSettings:enableBluetooth")
      : t("screens:enfSettings:buttonDisabled");
    buttonAccessibilityLabel = t(
      "screens:enfSettings:buttonDisabledAccessibility",
    );
  }

  const renderBluetoothTip = useMemo(() => {
    if (!enabled || !bluetoothDisabled) {
      return null;
    }

    return (
      <BluetoothTipContainer>
        <Tip {...presets.warning}>
          <TipText>{t("screens:enfSettings:bluetoothMessageTip")}</TipText>
          <VerticalSpacing height={10} />
          <>
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
            <VerticalSpacing height={3} />
          </>
        </Tip>
      </BluetoothTipContainer>
    );
  }, [enabled, bluetoothDisabled, handleBluetoothOn, t]);

  const findOutMoreLink = useMemo(() => {
    return (
      <SecondaryButton
        text={t("screens:enfSettings:secondaryButton")}
        onPress={onFindOutMorePress}
        accessibilityLabel={t(
          "screens:enfSettings:secondaryButtonAccessibilityLabel",
        )}
        accessibilityHint={t(
          "screens:enfSettings:secondaryButtonAccessibilityHint",
        )}
        accessibilityRole="link"
        align={"left"}
      />
    );
  }, [t, onFindOutMorePress]);

  const renderScanningTips = useMemo(() => {
    if (!retryPassed) {
      return (
        <>
          <Tip backgroundColor={colors.lightYellow}>
            <ImageContainer>
              <CovidSafe source={assets.covidSafe} />
            </ImageContainer>

            <TipSubHeading>
              {t("screens:enfSettings:tipSubHeading")}
            </TipSubHeading>
            <TipText>{t("screens:enfSettings:tipDescription")}</TipText>
          </Tip>
          <VerticalSpacing height={12} />
        </>
      );
    } else {
      return;
    }
  }, [retryPassed, t]);

  useAccessibleTitle();

  return (
    <FormV2
      ref={formRef}
      headerImage={require("../assets/images/information.png")}
      headerImageAccessibilityLabel={t(
        "screens:enfSettings:headerImageAccessibilityLabel",
      )}
      bannerText={bannerText}
      bannerColor={bannerColor}
      bannerTextColor={bannerTextColor}
      bannerIcon={!retryPassed && bannerIcon}
      headerBackgroundColor={colors.lightGrey}
      headerImageStyle={commonStyles.headerImage}
      snapButtonsToBottom={true}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      buttonAccessibilityLabel={buttonAccessibilityLabel}
      bannerAccessibilityLabel={
        enabled
          ? bluetoothDisabled
            ? t("screens:enfSettings:bannerInactiveAccessibilityLabel")
            : t("screens:enfSettings:bannerEnabledAccessibilityLabel")
          : t("screens:enfSettings:bannerDisabledAccessibilityLabel")
      }
    >
      {renderBluetoothTip}
      <Heading>{t("screens:enfSettings:title")}</Heading>
      <Description>{t("screens:enfSettings:description")}</Description>
      {renderScanningTips}
      <SubHeading>{t("screens:enfSettings:yourPrivacy")}</SubHeading>
      <Subtext>{t("screens:enfSettings:yourPrivacySubtitle")}</Subtext>
      <SubHeading>{t("screens:enfSettings:howItWorks")}</SubHeading>
      <OrderedListItem
        item={t("screens:enfSettings:howItWorks1")}
        order={t("screens:enfSettings:order1")}
      />
      <OrderedListItem
        item={t("screens:enfSettings:howItWorks2")}
        order={t("screens:enfSettings:order2")}
      />
      <OrderedListItem
        item={t("screens:enfSettings:howItWorks3")}
        order={t("screens:enfSettings:order3")}
      />
      {findOutMoreLink}
    </FormV2>
  );
}
