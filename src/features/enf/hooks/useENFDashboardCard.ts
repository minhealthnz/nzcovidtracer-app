import { DashboardCard } from "@features/dashboard/types";
import { selectBluetoothEnfDisabled } from "@features/enf/selectors";
import {
  selectIsEnfEnabled,
  selectIsRetriable,
  selectIsVerified,
} from "@features/verification/selectors";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExposure } from "react-native-exposure-notification-service";
import { useSelector } from "react-redux";

import { ENFScreen } from "../screens";

export const useENFDashboardCard = (
  navigation: StackNavigationProp<MainStackParamList>,
): DashboardCard => {
  const { t } = useTranslation();

  const registrationRetriable = useSelector(selectIsRetriable);

  const verified = useSelector(selectIsVerified);
  const { supported: enfSupported } = useExposure();

  const bluetoothDisabled = useSelector(selectBluetoothEnfDisabled);
  const enfEnabled = useSelector(selectIsEnfEnabled);

  return useMemo<DashboardCard>(() => {
    let bluetoothCardProps: Pick<
      DashboardCard,
      "headerImage" | "title" | "description" | "onPress"
    >;

    if (!enfSupported || (!verified && !registrationRetriable)) {
      bluetoothCardProps = {
        headerImage: require("@features/dashboard/assets/icons/bluetooth-off.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:notSupported:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notSupported:description",
        ),
        onPress: () => {
          navigation.navigate(ENFScreen.NotSupported);
        },
      };
    } else if (!verified) {
      bluetoothCardProps = {
        headerImage: require("@features/dashboard/assets/icons/bluetooth-pending.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:notVerified:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notVerified:description",
        ),
        onPress: () => {
          navigation.navigate(ENFScreen.NotSupported);
        },
      };
    } else if (enfEnabled && bluetoothDisabled) {
      bluetoothCardProps = {
        headerImage: require("@features/dashboard/assets/icons/bluetooth-inactive.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:inactive:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:inactive:description",
        ),
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    } else if (enfEnabled) {
      bluetoothCardProps = {
        headerImage: require("@features/dashboard/assets/icons/bluetooth-on.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:enabled:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:enabled:description",
        ),
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    } else {
      bluetoothCardProps = {
        headerImage: require("@features/dashboard/assets/icons/bluetooth-off.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:disabled:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:disabled:description",
        ),
        onPress: () => {
          navigation.navigate(ENFScreen.Settings);
        },
      };
    }

    return {
      ...bluetoothCardProps,
      isImportant: true,
      accessibilityHint:
        !enfSupported || !verified
          ? t(
              "screens:dashboard:cards:bluetoothTracing:notSupported:accessibilityHint",
            )
          : t("screens:dashboard:cards:bluetoothTracing:accessibilityHint"),
    };
  }, [
    t,
    enfEnabled,
    enfSupported,
    verified,
    registrationRetriable,
    bluetoothDisabled,
    navigation,
  ]);
};
