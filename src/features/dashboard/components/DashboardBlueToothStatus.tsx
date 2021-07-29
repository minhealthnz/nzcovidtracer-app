import { StatusCard } from "@components/atoms/StatusCard";
import { colors } from "@constants";
import { ENFScreen } from "@features/enf/screens";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import {
  selectIsEnfEnabled,
  selectIsRetriable,
  selectIsVerified,
} from "@features/verification/selectors";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExposure } from "react-native-exposure-notification-service";
import { useSelector } from "react-redux";

export function DashboardBluetoothStatus() {
  const { t } = useTranslation();

  const registrationRetriable = useSelector(selectIsRetriable);

  const verified = useSelector(selectIsVerified);
  const { supported: enfSupported } = useExposure();

  const bluetoothDisabled = useSelector(selectBluetoothEnfDisabled);
  const enfEnabled = useSelector(selectIsEnfEnabled);
  const navigation = useNavigation();

  const {
    statusImage,
    statusText,
    description,
    backgroundColor,
    onPress,
  } = useMemo(() => {
    if (!enfSupported || (!verified && !registrationRetriable)) {
      return {
        statusImage: require("@features/dashboard/assets/images/bluetooth-not-supported.png"),
        statusText: t(
          "screens:dashboard:cards:bluetoothTracing:notSupported:status",
        ),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notSupported:description",
        ),
        backgroundColor: colors.darkGrey,
        onPress: () => {
          navigation.navigate(ENFScreen.NotSupported);
        },
      };
    } else if (!verified) {
      return {
        statusImage: require("@features/dashboard/assets/images/bluetooth-pending.png"),
        statusText: t(
          "screens:dashboard:cards:bluetoothTracing:notVerified:status",
        ),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notVerified:description",
        ),
        backgroundColor: colors.darkGrey,
        onPress: () => {
          navigation.navigate(ENFScreen.NotSupported);
        },
      };
    } else if (enfEnabled && bluetoothDisabled) {
      return {
        statusImage: require("@features/dashboard/assets/images/bluetooth-inactive.png"),
        statusText: t(
          "screens:dashboard:cards:bluetoothTracing:inactive:status",
        ),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:inactive:description",
        ),
        backgroundColor: colors.orange,
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    } else if (enfEnabled) {
      return {
        statusImage: require("@features/dashboard/assets/images/bluetooth-on.png"),
        statusText: t(
          "screens:dashboard:cards:bluetoothTracing:enabled:status",
        ),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:enabled:description",
        ),
        backgroundColor: colors.green,
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    } else {
      return {
        statusImage: require("@features/dashboard/assets/images/bluetooth-off.png"),
        statusText: t(
          "screens:dashboard:cards:bluetoothTracing:disabled:status",
        ),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:disabled:description",
        ),
        backgroundColor: colors.failure,
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    }
  }, [
    t,
    enfEnabled,
    enfSupported,
    verified,
    registrationRetriable,
    bluetoothDisabled,
    navigation,
  ]);

  return (
    <StatusCard
      title={t("screens:dashboard:cards:bluetoothTracing:title")}
      description={description}
      onPress={onPress}
      statusImage={statusImage}
      statusText={statusText}
      backgroundColor={backgroundColor}
    />
  );
}
