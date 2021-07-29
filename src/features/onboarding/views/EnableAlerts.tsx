import { Button } from "@components/atoms";
import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { requestNotificationPermission } from "@features/device/reducer";
import { selectNotificationPermission } from "@features/device/selectors";
import { rescheduleReminders } from "@features/reminder/commonActions";
import { commonStyles } from "@lib/commonStyles";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { OnboardingScreen } from "../screens";
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
      dispatch(rescheduleReminders());
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
    dispatch(rescheduleReminders());
    navigateNext();
  }, [notificationPermission, navigateNext, dispatch]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={require("../assets/images/alarm.png")}
      heading={t("screens:enableAlerts:heading")}
      headerImageStyle={commonStyles.headerImage}
      headerImageAccessibilityLabel={t("screens:enableAlerts:headerImageLabel")}
      headerBackgroundColor={colors.lightGrey}
      headingStyle={commonStyles.headingBig}
      description={t("screens:enableAlerts:description")}
      renderButton={renderButton}
      snapButtonsToBottom={true}
    />
  );
}
