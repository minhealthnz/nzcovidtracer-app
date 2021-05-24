import { DashboardCard } from "@features/dashboard/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { useTranslation } from "react-i18next";

export const useRecordVisitDashboardCard = (
  navigation: StackNavigationProp<MainStackParamList>,
): DashboardCard => {
  const { t } = useTranslation();
  return {
    headerImage: require("@features/dashboard/assets/icons/scan.png"),
    title: t("screens:dashboard:cards:places:title"),
    description: t("screens:dashboard:cards:places:description"),
    onPress: () => {
      navigation.navigate(TabScreen.RecordVisit);
    },
    isImportant: true,
  };
};
