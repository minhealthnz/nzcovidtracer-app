import { Text, VerticalSpacing } from "@components/atoms";
import { Card } from "@components/molecules/Card";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid3x,
  resourcesLink,
} from "@constants";
import { Announcement } from "@features/announcement/components/Announcement";
import { AnnouncementEvents } from "@features/announcement/events";
import { selectAnnouncement } from "@features/announcement/selectors";
import { requestNotificationPermission } from "@features/device/reducer";
import { selectNotificationPermission } from "@features/device/selectors";
import { ENFScreen } from "@features/enf/screens";
import { BeenInCloseContact } from "@features/enfExposure/components/beenInCloseContact/BeenInCloseContact";
import { useProcessEnfContacts } from "@features/enfExposure/hooks/useProcessEnfContacts";
import { selectENFAlert } from "@features/enfExposure/selectors";
import { recordCallbackSendPressed } from "@features/exposure/analytics";
import { BeenInContact } from "@features/exposure/components/BeenInContact/BeenInContact";
import { getMatch as getExposureMatch } from "@features/exposure/reducer";
import { RequestCallbackScreen } from "@features/exposure/screens";
import { selectMatch } from "@features/exposure/selectors";
import { setHasSeenDashboard } from "@features/onboarding/reducer";
import { DiaryPercentage } from "@features/scan/components/DiaryPercentage";
import { useStatsSection } from "@features/stats/hooks/useStatsSection";
import { setEnfEnabled } from "@features/verification/commonActions";
import {
  selectIsRetriable,
  selectIsVerified,
} from "@features/verification/selectors";
import { debounce } from "@navigation/debounce";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  ListRenderItemInfo,
  SectionList,
  SectionListData,
  Share,
  StyleSheet,
} from "react-native";
import { useExposure } from "react-native-exposure-notification-service";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import DashboardFooter from "../components/DashboardFooter";
import { DashboardItemSeparator } from "../components/DashboardItemSeparator";
import { StatsLoading } from "../components/StatsLoading";
import { selectTestLocationsLink } from "../selectors";
import { DashboardCard, DashboardItem } from "../types";

const CardRow = styled.View`
  padding: 0 ${grid2x}px;
`;

const FooterRow = styled.View`
  padding-top: 0px;
  padding-bottom: ${grid2x}px;
  padding-horizontal: ${grid2x}px;
`;

const Section = styled.View`
  margin-bottom: ${grid}px;
  padding-horizontal: ${grid2x}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitleView = styled.View`
  flex-direction: column;
`;

const SectionTitle = styled(Text)`
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  color: ${colors.primaryGray};
`;

const SectionFooter = styled(Text)`
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryGray};
  margin: 2px 0 ${grid3x}px ${grid2x}px;
`;

const SectionFooterUrl = styled(Text)`
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryGray};
  text-decoration: underline;
`;

const SectionSubTitle = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  line-height: 16px;
  color: ${colors.primaryGray};
`;

const SectionCTA = styled.TouchableOpacity`
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  height: 20px;
`;

const SectionCTATitle = styled.Text`
  line-height: 20px;
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-bold"]};
  text-decoration-line: underline;
`;

interface Props
  extends BottomTabScreenProps<MainStackParamList, TabScreen.Home> {}

export const Dashboard = (props: Props) => {
  const { t } = useTranslation();
  const navigation = props.navigation;
  const navigate = props.navigation.navigate;
  const dispatch = useDispatch();
  const notificationPermission = useSelector(selectNotificationPermission);
  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);
  const verified = useSelector(selectIsVerified);
  const testLocationsLink = useSelector(selectTestLocationsLink);

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

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.Dashboard);
    }, []),
  );

  const beenInContact = exposureMatch == null ? undefined : "beenInContact";
  const beenInCloseContact = enfAlert ? "beenInCloseContact" : null;
  const doubleExposure = !!beenInContact && !!beenInCloseContact;

  const { enabled: enfEnabled, supported: enfSupported } = useExposure();

  // Sync enf enabled
  useEffect(() => {
    dispatch(setEnfEnabled(enfEnabled));
  }, [dispatch, enfEnabled]);

  const registrationRetriable = useSelector(selectIsRetriable);

  const announcement = useSelector(selectAnnouncement);

  const statsSection = useStatsSection();

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

    let bluetoothCardProps: Pick<
      DashboardCard,
      "headerImage" | "title" | "description" | "onPress"
    >;

    if (!enfSupported || (!verified && !registrationRetriable)) {
      bluetoothCardProps = {
        headerImage: require("../assets/icons/bluetooth-off.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:notSupported:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notSupported:description",
        ),
        onPress: () => {
          navigate(ENFScreen.NotSupported);
        },
      };
    } else if (!verified) {
      bluetoothCardProps = {
        headerImage: require("../assets/icons/bluetooth-pending.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:notVerified:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:notVerified:description",
        ),
        onPress: () => {
          navigate(ENFScreen.NotSupported);
        },
      };
    } else if (enfEnabled) {
      bluetoothCardProps = {
        headerImage: require("../assets/icons/bluetooth-on.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:enabled:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:enabled:description",
        ),
        onPress: () => {
          navigate(ENFScreen.Settings);
        },
      };
    } else {
      bluetoothCardProps = {
        headerImage: require("../assets/icons/bluetooth-off.png"),
        title: t("screens:dashboard:cards:bluetoothTracing:disabled:title"),
        description: t(
          "screens:dashboard:cards:bluetoothTracing:disabled:description",
        ),
        onPress: () => {
          navigate(ENFScreen.Settings);
        },
      };
    }

    const bluetoothTracingCard: DashboardItem = {
      ...bluetoothCardProps,
      isImportant: true,
      accessibilityHint:
        !enfSupported || !verified
          ? t(
              "screens:dashboard:cards:bluetoothTracing:notSupported:accessibilityHint",
            )
          : t("screens:dashboard:cards:bluetoothTracing:accessibilityHint"),
    };

    const announcementItems = announcement
      ? [
          {
            title: t("announcement:announcement"),
            data: announcement == null ? [] : ["announcement" as const],
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
      {
        title: t("screens:dashboard:sections:trace"),
        data: [
          {
            headerImage: require("../assets/icons/scan.png"),
            title: t("screens:dashboard:cards:places:title"),
            description: t("screens:dashboard:cards:places:description"),
            onPress: () => {
              navigate(TabScreen.RecordVisit);
            },
            isImportant: true,
          },
          bluetoothTracingCard,
          "diaryPercentage",
        ],
      },
      statsSection,
      {
        title: t("screens:dashboard:sections:advice"),
        data: [
          {
            headerImage: require("../assets/icons/test.png"),
            title: t("screens:dashboard:cards:test:title"),
            description: t("screens:dashboard:cards:test:description"),
            onPress: () => {
              Linking.openURL(testLocationsLink);
            },
            isLink: true,
          },
          {
            headerImage: require("../assets/icons/information.png"),
            title: t("screens:dashboard:cards:moreInfo:title"),
            description: t("screens:dashboard:cards:moreInfo:description"),
            onPress: () => {
              Linking.openURL(resourcesLink);
            },
            isLink: true,
          },
          {
            headerImage: require("../assets/icons/be-kind.png"),
            title: t("screens:dashboard:cards:unite:title"),
            description: t("screens:dashboard:cards:unite:description"),
            onPress: debounce(() => {
              Share.share({
                message: t("screens:dashboard:cards:unite:shareMessage"),
              });
            }),
          },
          "footer",
        ],
      },
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
    enfEnabled,
    navigate,
    dispatch,
    enfSupported,
    verified,
    beenInContact,
    beenInCloseContact,
    doubleExposure,
    registrationRetriable,
    statsSection,
    testLocationsLink,
    announcement,
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
      return (
        <FooterRow>
          <DashboardFooter />
        </FooterRow>
      );
    }

    if (item === "beenInCloseContact") {
      return (
        <CardRow>
          <BeenInCloseContact
            enfAlert={enfAlert}
            onRequestCallback={() => {
              const alertType = "enf";
              recordCallbackSendPressed(alertType);
              navigation.navigate(RequestCallbackScreen.RequestCallback, {
                alertType,
              });
            }}
          />
        </CardRow>
      );
    }

    if (item === "beenInContact") {
      return (
        <CardRow>
          <BeenInContact
            onRequestCallback={() => {
              const alertType = "location";
              recordCallbackSendPressed(alertType);
              navigation.navigate(RequestCallbackScreen.RequestCallback, {
                alertType,
              });
            }}
          />
        </CardRow>
      );
    }

    if (item === "statsLoading") {
      return (
        <CardRow>
          <StatsLoading />
        </CardRow>
      );
    }

    if (item === "announcement") {
      return (
        <CardRow>
          <Announcement />
        </CardRow>
      );
    }

    if (item === "diaryPercentage") {
      return (
        <CardRow>
          <DiaryPercentage />
        </CardRow>
      );
    }

    return (
      <CardRow>
        <Card {...item} />
      </CardRow>
    );
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
      contentContainerStyle={styles.flatListContainer}
      scrollEnabled={true}
      stickySectionHeadersEnabled={false}
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
          <Section>
            <SectionTitleView accessible={true}>
              <SectionTitle accessibilityRole="header">
                {info.section.title}
              </SectionTitle>
              {info.section.subTitle && (
                <SectionSubTitle>{info.section.subTitle}</SectionSubTitle>
              )}
            </SectionTitleView>
            {info.section.ctaTitle && (
              <SectionCTA
                accessibilityLabel={
                  info.section.ctaAccessibilityTitle || info.section.ctaTitle
                }
                accessibilityRole="button"
                onPress={info.section.ctaCallback}
              >
                <SectionCTATitle>{info.section.ctaTitle}</SectionCTATitle>
              </SectionCTA>
            )}
          </Section>
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

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: grid2x,
  },
  spacing: {
    paddingHorizontal: grid2x,
  },
});
