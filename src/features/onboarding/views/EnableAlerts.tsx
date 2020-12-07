import { Button } from "@components/atoms";
import { FormV2 } from "@components/molecules/FormV2";
import { requestNotificationPermission } from "@domain/device/reducer";
import { selectNotificationPermission } from "@domain/device/selectors";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { OnboardingScreen } from "../screens";
import { styles } from "../styles";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

interface Props
  extends StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.EnableAlerts
  > {}

export function EnableAlerts(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const enableTrigger = useRef(false);

  const notificationPermission = useSelector(selectNotificationPermission);

  const { navigateNext } = useOnboardingFlow(
    props,
    OnboardingScreen.EnableAlerts,
  );

  const handlePress = useCallback(() => {
    if (notificationPermission === "granted") {
      navigateNext();
    } else {
      enableTrigger.current = true;
      dispatch(requestNotificationPermission());
    }
  }, [notificationPermission, dispatch, navigateNext]);

  const renderButton = useCallback(
    () => (
      <Button
        buttonColor={notificationPermission === "granted" ? "green" : "black"}
        text={
          notificationPermission === "granted"
            ? t("screens:enableAlerts:done")
            : t("screens:enableAlerts:enableNotifications")
        }
        onPress={handlePress}
      />
    ),
    [notificationPermission, handlePress, t],
  );

  useEffect(() => {
    if (!enableTrigger.current) {
      return;
    }
    enableTrigger.current = false;
    navigateNext();
  }, [notificationPermission, navigateNext, dispatch]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={require("../assets/images/alarm.png")}
      heading={t("screens:enableAlerts:heading")}
      headingStyle={styles.headingBig}
      description={t("screens:enableAlerts:description")}
      renderButton={renderButton}
    />
  );
}
