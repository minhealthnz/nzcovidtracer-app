import { Banner, BannerText } from "@components/atoms/Banner";
import { colors, grid } from "@constants";
import { ENFScreen } from "@features/enf/screens";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import {
  selectIsRetriable,
  selectIsVerified,
} from "@features/verification/selectors";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExposure } from "react-native-exposure-notification-service";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const Chevron = styled.Image`
  margin-left: auto;
`;

const BluetoothIcon = styled.Image`
  margin-left: ${grid}px;
`;

const BluetoothBanner = styled.TouchableOpacity`
  z-index: 100;
`;

const assets = {
  turnOnBluetooth: require("@assets/icons/turn-on-bluetooth.png"),
  blueToothRunning: require("@assets/icons/bluetooth-running.png"),
  activateBluetooth: require("@assets/icons/activate-bluetooth.png"),
  activatingOrNotSupported: require("@assets/icons/activating-Or-Not-Supported.png"),
  chevron: require("@assets/icons/chevron-right.png"),
  chevronWhite: require("@assets/icons/chevron-right-white.png"),
};

export function ScannerBanner() {
  const { enabled, supported: enfSupported } = useExposure();
  const verified = useSelector(selectIsVerified);
  const bluetoothDisabled = useSelector(selectBluetoothEnfDisabled);
  const registrationRetriable = useSelector(selectIsRetriable);
  const { t } = useTranslation();

  const navigation = useNavigation();

  const enfNotSupported =
    !enfSupported || (!verified && !registrationRetriable);
  const enfActivating = !verified;
  const enfEnabled = enabled;

  const {
    text,
    textColor,
    backgroundColor,
    chevron,
    bluetoothIcon,
    onPress,
  } = useMemo(() => {
    if (enabled && bluetoothDisabled) {
      return {
        text: t("screens:scan:blueToothTracingStatus:inactive"),
        textColor: colors.primaryBlack,
        backgroundColor: colors.orange,
        chevron: assets.chevron,
        bluetoothIcon: assets.activateBluetooth,
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    } else {
      return {
        text: t("screens:scan:blueToothTracingStatus:disabled"),
        textColor: colors.white,
        backgroundColor: colors.red,
        chevron: assets.chevronWhite,
        bluetoothIcon: assets.turnOnBluetooth,
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    }
  }, [enabled, bluetoothDisabled, t, navigation]);

  return (
    <>
      {enfNotSupported ||
      enfActivating ||
      (enfEnabled && !bluetoothDisabled) ? null : (
        <BluetoothBanner
          onPress={onPress}
          activeOpacity={1}
          accessibilityLabel={text}
          accessibilityHint={t("screens:scan:accessibility:topBannerHint")}
        >
          <Banner color={backgroundColor} paddingHorizontal={12}>
            <BluetoothIcon source={bluetoothIcon} />
            <BannerText maxFontSizeMultiplier={1} color={textColor}>
              {text}
            </BannerText>
            <Chevron source={chevron} />
          </Banner>
        </BluetoothBanner>
      )}
    </>
  );
}
