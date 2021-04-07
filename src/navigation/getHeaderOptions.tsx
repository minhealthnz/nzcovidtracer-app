import { getHeaderOptions as getDashboard } from "@features/dashboard/getHeaderOptions";
import { getHeaderOptions as getScan } from "@features/scan/getHeaderOptions";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { TFunction } from "i18next";

import { getHeaderTitle } from "./getHeaderTitle";

export function getHeaderOptions(
  initialTab: TabScreen.Home | TabScreen.RecordVisit,
  navigation: StackNavigationProp<MainStackParamList>,
  route: string | undefined,
  t: TFunction,
) {
  const options = _getHeaderOptions(initialTab, navigation, route, t);

  return { ...options, title: getHeaderTitle(initialTab, route, t) };
}

export function _getHeaderOptions(
  initialTab: TabScreen.Home | TabScreen.RecordVisit,
  navigation: StackNavigationProp<MainStackParamList>,
  routeName: string | undefined,
  t: TFunction,
) {
  routeName = routeName || initialTab;

  switch (routeName) {
    case TabScreen.Home:
      return getDashboard(t);
    case TabScreen.RecordVisit:
      return getScan(navigation, t);
    default:
      return {};
  }
}
