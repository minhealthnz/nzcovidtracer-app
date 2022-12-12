import Divider from "@components/atoms/Divider";
import { SettingToggle } from "@components/molecules";
import { Card } from "@components/molecules/Card";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { colors, grid, grid3x } from "@constants";
import {
  requestNotificationPermission,
  requestToggleAnnouncements,
  setShouldSubscribeToAnnouncementsByDefault,
} from "@features/device/reducer";
import {
  selectNotificationPermission,
  selectSubscriptions,
} from "@features/device/selectors";
import { usePrevious } from "@hooks/usePrevious";
import { useAppDispatch } from "@lib/useAppDispatch";
import { isUndefined } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const announcements = "announcements";

const ToggleContainer = styled.View`
  background: ${colors.white};
  padding: ${grid}px ${grid3x}px;
`;

const CardContainer = styled.View`
  padding: ${grid}px ${grid3x}px;
`;

// Vertical spacing with coloured background acting as a divider
const ColouredSpacing = styled.View`
  background: ${colors.lightGrey};
  border-color: ${colors.platinum};
  border-top-width: 1px;
  border-bottom-width: 1px;
  height: 10px;
`;

export function Settings() {
  // Ref to update the toaster.
  const formRef = useRef<FormV2Handle | null>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Check notifications
  const notificationPerm = useSelector(selectNotificationPermission);
  let notificationsCard: any = null;
  if (notificationPerm === "denied" || notificationPerm === "blocked") {
    notificationsCard = {
      headerImage: require("../../dashboard/assets/icons/alarm.png"),
      title: t("screens:dashboard:cards:contactAlerts:title"),
      description: t(
        "screens:dashboard:cards:contactAlerts:descriptionSettings",
      ),
      onPress: () => {
        dispatch(requestNotificationPermission());
      },
    };
  }

  const subscriptions = useSelector(selectSubscriptions);
  const [isSubscriptionLoading, setIsSubscriptionLoading] =
    useState<boolean>(false);

  // Get current and previous value of the announcement toggle.
  // Current value will be passed into the dispatch function to know if opting in or out.
  const isAnnouncementSubscribed = !!(
    subscriptions[announcements] && subscriptions[announcements].fullfilled
  );
  const previousAnnouncementToggle = usePrevious(isAnnouncementSubscribed);

  // Get current and previous value of the announcement subscription error
  const isAnnouncementsError = !!(
    subscriptions[announcements] &&
    !subscriptions[announcements].fullfilled &&
    subscriptions[announcements].error
  );
  const previousAnnouncementError = usePrevious(isAnnouncementsError);

  // Set loading as false the toggle is finished awaiting.
  useEffect(() => {
    if (isAnnouncementSubscribed !== previousAnnouncementToggle) {
      setIsSubscriptionLoading(false);
    }
  }, [isAnnouncementSubscribed, previousAnnouncementToggle]);

  // If there is an error, show as toaster.
  useEffect(() => {
    if (
      !isUndefined(previousAnnouncementError) &&
      isAnnouncementsError &&
      isAnnouncementsError !== previousAnnouncementError
    ) {
      formRef.current?.showToast(t("screens:settings:announcementsError"));
      setIsSubscriptionLoading(false);
    }
  }, [t, isAnnouncementsError, previousAnnouncementError]);

  const onToggleAnnouncements = useCallback(() => {
    setIsSubscriptionLoading(true);
    dispatch(requestToggleAnnouncements(!isAnnouncementSubscribed));
    dispatch(setShouldSubscribeToAnnouncementsByDefault(false));
  }, [dispatch, isAnnouncementSubscribed]);

  return (
    <FormV2 padding={0} ref={formRef}>
      {notificationsCard && (
        <>
          <CardContainer>
            <Card {...notificationsCard} isFullWidth />
          </CardContainer>
          <ColouredSpacing />
        </>
      )}
      <ToggleContainer>
        <SettingToggle
          title={t("screens:settings:contactAlerts")}
          description={t("screens:settings:contactAlertsDescription")}
        />
        <Divider />
        <SettingToggle
          value={isAnnouncementSubscribed}
          onPress={onToggleAnnouncements}
          title={t("screens:settings:announcements")}
          description={t("screens:settings:announcementsDescription")}
          isLoading={isSubscriptionLoading}
        />
      </ToggleContainer>
    </FormV2>
  );
}
