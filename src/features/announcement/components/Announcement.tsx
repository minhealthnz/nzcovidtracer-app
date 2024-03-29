import { NotificationCard } from "@components/molecules/NotificationCard";
import { useLinking } from "@linking/useLinking";
import moment from "moment-timezone";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { recordAnalyticEvent } from "../../../analytics";
import { AnnouncementEvents } from "../events";
import { dismissAnnouncement } from "../reducer";
import { selectAnnouncement } from "../selectors";

export function Announcement() {
  const announcement = useSelector(selectAnnouncement);

  const { openDeepLink, openExternalLink } = useLinking();

  const handlePressSecondaryButton = useCallback(() => {
    if (announcement == null) {
      return;
    }
    if (announcement.deepLink) {
      openDeepLink(announcement.deepLink);
    } else if (announcement.link) {
      openExternalLink(announcement.link);
    }
  }, [announcement, openDeepLink, openExternalLink]);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleDismiss = useCallback(() => {
    Alert.alert(t("announcement:dismissTitle"), undefined, [
      {
        text: t("announcement:cancel"),
        style: "cancel",
      },
      {
        text: t("announcement:ok"),
        onPress: () => {
          dispatch(dismissAnnouncement());
          recordAnalyticEvent(AnnouncementEvents.AnnouncementDismissed);
        },
      },
    ]);
  }, [dispatch, t]);

  if (announcement == null) {
    return null;
  }

  return (
    <NotificationCard
      onDimiss={handleDismiss}
      icon={require("@features/dashboard/assets/icons/error.png")}
      heading={moment(announcement.createdAt).format("DD MMMM YYYY")}
      title={announcement.title}
      body={announcement.message}
      secondaryButtonText={announcement.linkText}
      onPressSecondaryButton={handlePressSecondaryButton}
    />
  );
}
