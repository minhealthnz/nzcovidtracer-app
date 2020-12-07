import { Text } from "@components/atoms/Text";
import { colors } from "@constants";
import { DashboardNavigator } from "@features/dashboard/views/DashboardNavigator";
import { selectENFAlert } from "@features/enfExposure/selectors";
import { selectMatch } from "@features/exposure/selectors";
import {
  selectHasSeenDashboard,
  selectHasSeenDashboardEnf,
} from "@features/onboarding/selectors";
import { TabProfileNavigator } from "@features/profile/views/TabProfileNavigator";
import { TabScanNavigator } from "@features/scan/views/TabScanNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ImageSourcePropType,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { MainStackParamList } from "./MainStack";
import { TabScreen } from "./screens";
import { TabBarIcon } from "./TabBarIcon";

const assets = {
  dashboardInactive: require("@assets/images/dashboard-inactive.png"),
  dashboardActive: require("@assets/images/dashboard-active.png"),
  myProfileInactive: require("@assets/images/my-profile-inactive.png"),
  myProfileActive: require("@assets/images/my-profile-active.png"),
  recordVisitInactive: require("@assets/images/record-visit-inactive.png"),
  recordVisitActive: require("@assets/images/record-visit-active.png"),
};

export type RootTabParamList = {
  [TabScreen.Home]: undefined;
  [TabScreen.RecordVisit]: undefined;
  [TabScreen.MyData]: undefined;
} & MainStackParamList;

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  const { t } = useTranslation();

  const hasSeenDashboard = useSelector(selectHasSeenDashboard);
  const hasSeenDashboardEnf = useSelector(selectHasSeenDashboardEnf);
  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);

  const hasAlertOnDashboard = Boolean(exposureMatch || enfAlert);
  const initialRouteName =
    !hasSeenDashboard || !hasSeenDashboardEnf || hasAlertOnDashboard
      ? TabScreen.Home
      : TabScreen.RecordVisit;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      tabBarOptions={{
        style: { backgroundColor: colors.black },
        activeTintColor: colors.yellow,
        inactiveTintColor: colors.white,
        keyboardHidesTabBar: true,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let imageSource: ImageSourcePropType | undefined;

          switch (route.name as keyof RootTabParamList) {
            case TabScreen.Home:
              imageSource = focused
                ? assets.dashboardActive
                : assets.dashboardInactive;
              break;
            case TabScreen.RecordVisit:
              imageSource = focused
                ? assets.recordVisitActive
                : assets.recordVisitInactive;
              break;
            case TabScreen.MyData:
              imageSource = focused
                ? assets.myProfileActive
                : assets.myProfileInactive;
              break;
          }

          if (imageSource) {
            const routeName = route.name;
            return <TabBarIcon source={imageSource} routeName={routeName} />;
          }

          return null;
        },
      })}
    >
      <Tab.Screen
        name={TabScreen.Home}
        component={DashboardNavigator}
        options={{
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              {...props}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t("screenTitles:dashboard")}
              accessibilityHint={t("common:tab1of3")}
            >
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: (props) => (
            <Text
              fontFamily="open-sans-semi-bold"
              color={props.color}
              fontSize={10}
              lineHeight={12}
              maxFontSizeMultiplier={1.25}
            >
              {t("screenTitles:dashboard")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name={TabScreen.RecordVisit}
        component={TabScanNavigator}
        options={{
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              {...props}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t("screenTitles:recordVisit")}
              accessibilityHint={t("common:tab2of3")}
            >
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: (props) => (
            <Text
              fontFamily="open-sans-semi-bold"
              color={props.color}
              fontSize={10}
              lineHeight={12}
              maxFontSizeMultiplier={1.25}
            >
              {t("screenTitles:recordVisit")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name={TabScreen.MyData}
        component={TabProfileNavigator}
        options={{
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              {...props}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t("screenTitles:myData")}
              accessibilityHint={t("common:tab3of3")}
            >
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: (props) => (
            <Text
              fontFamily="open-sans-semi-bold"
              color={props.color}
              fontSize={10}
              lineHeight={12}
              maxFontSizeMultiplier={1.25}
            >
              {t("screenTitles:myData")}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
