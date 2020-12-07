import { Text, VerticalSpacing } from "@components/atoms";
import { Card } from "@components/molecules/Card";
import {
  addressLink,
  colors,
  contactDetailsLink,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid3x,
  resourcesLink,
} from "@constants";
import { requestNotificationPermission } from "@domain/device/reducer";
import { selectNotificationPermission } from "@domain/device/selectors";
import { selectUser } from "@domain/user/selectors";
import { ENFScreen } from "@features/enf/screens";
import { recordDismissENFAlert } from "@features/enfExposure/analytics";
import { BeenInCloseContact } from "@features/enfExposure/components/beenInCloseContact/BeenInCloseContact";
import { useProcessEnfContacts } from "@features/enfExposure/hooks/useProcessEnfContacts";
import { dismissEnfAlert } from "@features/enfExposure/reducer";
import { selectENFAlert } from "@features/enfExposure/selectors";
import { recordDismissLocationAlert } from "@features/exposure/analytics";
import { BeenInContact } from "@features/exposure/components/BeenInContact/BeenInContact";
import {
  acknowledgeMatches,
  getMatch as getExposureMatch,
} from "@features/exposure/reducer";
import { RequestCallbackScreen } from "@features/exposure/screens";
import { selectMatch } from "@features/exposure/selectors";
import { NHIScreen } from "@features/nhi/screens";
import { setHasSeenDashboard } from "@features/onboarding/reducer";
import { setEnfEnabled } from "@features/verification/commonActions";
import {
  selectIsRetriable,
  selectIsVerified,
} from "@features/verification/selectors";
import { debounce } from "@navigation/debounce";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { TabScreen } from "@views/screens";
import { RootTabParamList } from "@views/TabNavigator";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ImageSourcePropType,
  Linking,
  ListRenderItemInfo,
  SectionList,
  SectionListData,
  Share,
  StyleSheet,
} from "react-native";
import { useExposure } from "react-native-exposure-notification-service";
import { batch, useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import DashboardFooter from "../components/DashboardFooter";
import { DashboardItemSeparator } from "../components/DashboardItemSeparator";

interface DashboardCard {
  headerImage: ImageSourcePropType;
  title: string;
  description: string;
  onPress: () => void;
  isFooter?: false;
  isImportant?: boolean;
  accessibilityHint?: string;
}

type DashboardItem =
  | DashboardCard
  | "footer"
  | "beenInCloseContact"
  | "beenInContact"
  | undefined
  | false;

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

const SectionTitle = styled(Text)`
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  color: ${colors.primaryGray};
`;

const SectionCTA = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 20px;
`;

const SectionCTATitle = styled.Text`
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  text-decoration-line: underline;
`;

interface Props
  extends BottomTabScreenProps<RootTabParamList, TabScreen.Home> {}

export const Dashboard = (props: Props) => {
  const { t } = useTranslation();
  const navigation = props.navigation;
  const navigate = props.navigation.navigate;
  const dispatch = useDispatch();
  const notificationPermission = useSelector(selectNotificationPermission);
  const exposureMatch = useSelector(selectMatch);
  const user = useSelector(selectUser);
  const hasNHI = useMemo(() => Boolean(user?.nhi), [user]);
  const enfAlert = useSelector(selectENFAlert);
  const verified = useSelector(selectIsVerified);

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

  useAccessibleTitle({
    hint: doubleExposure
      ? t("accessibility:dashboard:notificationTitleHintDouble")
      : beenInCloseContact || beenInContact
      ? t("accessibility:dashboard:notificationTitleHintSingle")
      : undefined,
  });

  const { enabled: enfEnabled, supported: enfSupported } = useExposure();

  // Sync enf enabled
  useEffect(() => {
    dispatch(setEnfEnabled(enfEnabled));
  }, [dispatch, enfEnabled]);

  const handleDismissAllAlerts = useCallback(() => {
    Alert.alert(t("screens:dashboard:alerts:dismiss:title"), undefined, [
      {
        text: t("screens:dashboard:alerts:dismiss:cancel"),
        style: "cancel",
      },
      {
        text: t("screens:dashboard:alerts:dismiss:dimiss"),
        onPress: () => {
          batch(() => {
            if (enfAlert) {
              // dismiss Bluetooth aslert
              recordDismissENFAlert(enfAlert);
              dispatch(dismissEnfAlert(enfAlert.exposureDate));
            }
            if (exposureMatch) {
              // dismiss Location alert
              recordDismissLocationAlert(exposureMatch);
              dispatch(acknowledgeMatches());
            }
          });
        },
      },
    ]);
  }, [dispatch, enfAlert, exposureMatch, t]);

  const registrationRetriable = useSelector(selectIsRetriable);

  const sections = useMemo(() => {
    const addNHICard: DashboardItem = !hasNHI && {
      headerImage: require("../assets/icons/nhi.png"),
      title: t("screens:dashboard:cards:nhi:title"),
      description: t("screens:dashboard:cards:nhi:description"),
      onPress: () => {
        navigate(NHIScreen.Navigator);
        recordAnalyticEvent(AnalyticsEvent.ViewNHIFromDashboard);
      },
    };

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
          navigate(ENFScreen.Navigator, {
            screen: ENFScreen.NotSupported,
          });
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
          navigate(ENFScreen.Navigator, {
            screen: ENFScreen.NotSupported,
          });
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
          navigate(ENFScreen.Navigator, {
            screen: ENFScreen.Settings,
          });
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
          navigate(ENFScreen.Navigator, {
            screen: ENFScreen.Settings,
          });
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

    const items: SectionListData<DashboardItem>[] = [
      {
        title: doubleExposure
          ? t("screens:dashboard:sections:alertDoubleExposure")
          : beenInCloseContact
          ? t("screens:dashboard:sections:alertENFExposure")
          : beenInContact
          ? t("screens:dashboard:sections:alertLocationExposure")
          : undefined,

        ctaTitle: doubleExposure
          ? t("screens:dashboard:alerts:dismissAllAction")
          : undefined,
        ctaCallback: handleDismissAllAlerts,

        data: beenInCloseContact == null ? [] : [beenInCloseContact],
      },
      {
        data: beenInContact == null ? [] : [beenInContact],
      },
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
        ],
      },
      {
        title: t("screens:dashboard:sections:help"),
        data: [
          {
            headerImage: require("../assets/icons/your-details.png"),
            title: t("screens:dashboard:cards:registerDetails:title"),
            description: t(
              "screens:dashboard:cards:registerDetails:description",
            ),
            onPress: () => {
              Linking.openURL(contactDetailsLink);
            },
          },
          {
            headerImage: require("../assets/icons/location.png"),
            title: t("screens:dashboard:cards:registerLocation:title"),
            description: t(
              "screens:dashboard:cards:registerLocation:description",
            ),
            onPress: () => {
              Linking.openURL(addressLink);
            },
          },
          addNHICard,
        ],
      },
      {
        title: t("screens:dashboard:sections:advice"),
        data: [
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
          {
            headerImage: require("../assets/icons/information.png"),
            title: t("screens:dashboard:cards:moreInfo:title"),
            description: t("screens:dashboard:cards:moreInfo:description"),
            onPress: () => {
              Linking.openURL(resourcesLink);
            },
          },
          "footer",
        ],
      },
    ];
    return items;
  }, [
    hasNHI,
    t,
    notificationPermission,
    enfEnabled,
    handleDismissAllAlerts,
    navigate,
    dispatch,
    enfSupported,
    verified,
    beenInContact,
    beenInCloseContact,
    doubleExposure,
    registrationRetriable,
  ]);

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
          <BeenInCloseContact enfAlert={enfAlert} />
        </CardRow>
      );
    }

    if (item === "beenInContact") {
      return (
        <CardRow>
          <BeenInContact
            onRequestCallback={() => {
              navigation.navigate(RequestCallbackScreen.Navigator);
            }}
          />
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
            <SectionTitle accessibilityRole="header">
              {info.section.title}
            </SectionTitle>
            {info.section.ctaTitle && (
              <SectionCTA
                accessibilityLabel={info.section.ctaTitle}
                accessibilityRole="button"
                onPress={info.section.ctaCallback}
              >
                <SectionCTATitle>{info.section.ctaTitle}</SectionCTATitle>
              </SectionCTA>
            )}
          </Section>
        ) : null
      }
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? null : <VerticalSpacing height={grid3x} />
      }
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
