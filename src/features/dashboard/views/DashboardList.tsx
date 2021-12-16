import { Text, VerticalSpacing } from "@components/atoms";
import { PlaceHolder } from "@components/atoms/PlaceHolder";
import { SectionHeader } from "@components/atoms/SectionHeader";
import { SectionList } from "@components/atoms/SectionList";
import { Card } from "@components/molecules/Card";
import { colors, fontFamilies, fontSizes, grid3x } from "@constants";
import { Announcement } from "@features/announcement/components/Announcement";
import { AnnouncementEvents } from "@features/announcement/events";
import { selectAnnouncement } from "@features/announcement/selectors";
import { requestNotificationPermission } from "@features/device/reducer";
import { selectNotificationPermission } from "@features/device/selectors";
import { DiaryPercentage } from "@features/diary/components/DiaryPercentage";
import { BeenInCloseContact } from "@features/enfExposure/components/beenInCloseContact/BeenInCloseContact";
import { useProcessEnfContacts } from "@features/enfExposure/hooks/useProcessEnfContacts";
import { selectENFAlert } from "@features/enfExposure/selectors";
import { recordCallbackSendPressed } from "@features/exposure/analytics";
import { BeenInContact } from "@features/exposure/components/BeenInContact/BeenInContact";
import { getMatch as getExposureMatch } from "@features/exposure/reducer";
import { RequestCallbackScreen } from "@features/exposure/screens";
import { selectMatch } from "@features/exposure/selectors";
import { setHasSeenDashboard } from "@features/onboarding/reducer";
import { ReminderCard } from "@features/reminder/components/ReminderCard";
import { selectHasInAppReminder } from "@features/reminder/selectors";
import { StatsCard } from "@features/stats/components/StatsCard";
import { useStatsSection } from "@features/stats/hooks/useStatsSection";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, ListRenderItemInfo, SectionListData } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { recordAnalyticEvent } from "../../../analytics";
import { DashboardBluetoothStatus } from "../components/DashboardBlueToothStatus";
import { DashboardFooter } from "../components/DashboardFooter";
import { DashboardItemSeparator } from "../components/DashboardItemSeparator";
import { DashboardVaccinePassInfo } from "../components/DashboardVaccinePassInfo";
import { selectHasSeenVaccinePassInfo } from "../selectors";
import { DashboardItem } from "../types";

const SectionFooter = styled(Text)`
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryGray};
  margin: 2px 0 ${grid3x}px 0;
`;

const SectionFooterUrl = styled(Text)`
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryGray};
  text-decoration: underline;
`;

interface Props extends StackScreenProps<MainStackParamList> {}

const _DashboardList = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notificationPermission = useSelector(selectNotificationPermission);
  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);

  // Listens for exposure.contacts change and triggers saga to update enfAlert if needed
  useProcessEnfContacts();

  useEffect(() => {
    dispatch(setHasSeenDashboard());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getExposureMatch());
    }, [dispatch]),
  );

  const beenInContact = exposureMatch == null ? undefined : "beenInContact";
  const beenInCloseContact = enfAlert ? "beenInCloseContact" : null;
  const doubleExposure = !!beenInContact && !!beenInCloseContact;

  const announcement = useSelector(selectAnnouncement);

  const statsSection = useStatsSection();

  const hasInAppReminder = useSelector(selectHasInAppReminder);

  const hasSeenVaccinePassInfo = useSelector(selectHasSeenVaccinePassInfo);

  const sections = useMemo(() => {
    const notificationsCard: DashboardItem | undefined =
      notificationPermission === "denied" ||
      notificationPermission === "blocked"
        ? {
            headerImage: require("../assets/icons/alarm.png"),
            title: t("screens:dashboard:cards:contactAlerts:title"),
            description: t("screens:dashboard:cards:contactAlerts:description"),
            onPress: () => {
              dispatch(requestNotificationPermission());
            },
          }
        : undefined;

    const announcementItems = announcement
      ? [
          {
            title: t("announcement:announcement"),
            data: announcement == null ? [] : ["announcement" as const],
          },
        ]
      : [];

    const reminders = hasInAppReminder
      ? [
          {
            title: t("screens:dashboard:sections:reminder"),
            data: ["reminder" as const],
          },
        ]
      : [];

    const infoItems = !hasSeenVaccinePassInfo
      ? [
          {
            title: t("screens:dashboard:sections:whatsNew"),
            data:
              hasSeenVaccinePassInfo == null
                ? []
                : ["vaccinePassInfo" as const],
          },
        ]
      : [];

    const items: SectionListData<DashboardItem>[] = [
      {
        title: doubleExposure
          ? t("screens:dashboard:sections:alertDoubleExposure")
          : beenInCloseContact
          ? t("screens:dashboard:sections:alertENFExposure")
          : beenInContact
          ? t("screens:dashboard:sections:alertLocationExposure")
          : undefined,
        data: beenInCloseContact == null ? [] : [beenInCloseContact],
      },
      {
        data: beenInContact == null ? [] : [beenInContact],
      },
      ...announcementItems,
      {
        data: notificationsCard == null ? [] : [notificationsCard],
      },
      ...infoItems,
      ...reminders,
      {
        title: t("screens:dashboard:sections:status"),
        data: ["bluetoothStatus", "diaryPercentage"],
      },
      statsSection,
    ];

    items.forEach((section) => {
      section.data.forEach((item) => {
        if (typeof item === "object") {
          if (item.isLink && item.accessibilityHint == null) {
            item.accessibilityHint = t(
              "screens:dashboard:linkAccessiblityHint",
            );
          }
        }
      });
    });

    return items;
  }, [
    t,
    notificationPermission,
    dispatch,
    beenInContact,
    beenInCloseContact,
    doubleExposure,
    statsSection,
    announcement,
    hasSeenVaccinePassInfo,
    hasInAppReminder,
  ]);

  useEffect(() => {
    if (announcement != null) {
      recordAnalyticEvent(AnnouncementEvents.AnnouncementDisplayed);
    }
  }, [announcement]);

  const renderItem = ({ item }: ListRenderItemInfo<DashboardItem>) => {
    if (!item) {
      return null;
    }

    if (item === "footer") {
      return <DashboardFooter />;
    }

    if (item === "beenInCloseContact") {
      return (
        <BeenInCloseContact
          enfAlert={enfAlert}
          onRequestCallback={() => {
            const alertType = "enf";
            recordCallbackSendPressed(alertType);
            props.navigation.navigate(RequestCallbackScreen.RequestCallback, {
              alertType,
            });
          }}
        />
      );
    }

    if (item === "beenInContact") {
      return (
        <BeenInContact
          onRequestCallback={() => {
            const alertType = "location";
            recordCallbackSendPressed(alertType);
            props.navigation.navigate(RequestCallbackScreen.RequestCallback, {
              alertType,
            });
          }}
        />
      );
    }

    if (item === "statsLoading") {
      return <PlaceHolder />;
    }

    if (item === "announcement") {
      return <Announcement />;
    }

    if (item === "diaryPercentage") {
      return <DiaryPercentage />;
    }

    if (item === "bluetoothStatus") {
      return <DashboardBluetoothStatus />;
    }

    if (item === "vaccinePassInfo") {
      return <DashboardVaccinePassInfo />;
    }

    if (item === "reminder") {
      return <ReminderCard isDashboard={true} />;
    }

    if (item.isStatistic) {
      return <StatsCard {...item} />;
    }

    return <Card {...item} />;
  };

  const renderItemSeparator = useCallback(
    (itemProps: { trailingItem: DashboardItem }) => {
      return (
        <DashboardItemSeparator
          isImportant={
            !!(
              typeof itemProps.trailingItem === "object" &&
              itemProps.trailingItem.isImportant
            )
          }
          isGrouped={
            !!(
              typeof itemProps.trailingItem === "object" &&
              itemProps.trailingItem.isGrouped
            )
          }
        />
      );
    },
    [],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(_card: DashboardItem | undefined, index: number) =>
        `card${index}`
      }
      renderItem={renderItem}
      ItemSeparatorComponent={renderItemSeparator}
      renderSectionHeader={(info: {
        section: SectionListData<DashboardItem>;
      }) =>
        info.section.title ? (
          <SectionHeader
            title={info.section.title}
            subtitle={info.section.subTitle}
            ctaAccessibilityTitle={info.section.ctaAccessibilityTitle}
            ctaTitle={info.section.ctaTitle}
            onCtaPress={info.section.ctaCallback}
          />
        ) : null
      }
      renderSectionFooter={({ section }) => {
        if (section.footer) {
          return (
            <SectionFooter
              onPress={
                section.footerUrl
                  ? () => Linking.openURL(section.footerUrl)
                  : undefined
              }
              accessibilityRole={section.footerUrl ? "link" : "none"}
              accessibilityLabel={[
                section.footer,
                section.footerUrlDisplay,
              ].join(" ")}
              accessibilityHint={
                section.footerUrl
                  ? t("screens:dashboard:linkAccessiblityHint")
                  : ""
              }
            >
              {section.footer}{" "}
              <SectionFooterUrl>{section.footerUrlDisplay}</SectionFooterUrl>
            </SectionFooter>
          );
        }
        return section.data.length === 0 ? null : (
          <VerticalSpacing height={grid3x} />
        );
      }}
    />
  );
};

export const DashboardList = memo(_DashboardList);
