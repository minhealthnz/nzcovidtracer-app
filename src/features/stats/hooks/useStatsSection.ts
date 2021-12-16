import { errorCardBackground } from "@features/dashboard/colors";
import { getCovidStatistics } from "@features/dashboard/reducer";
import {
  selectExpires,
  selectLastFetched,
  selectStats,
  selectStatsAreLoading,
  selectStatsEmpty,
  selectStatsError,
} from "@features/dashboard/selectors";
import { DashboardItem, StatItem } from "@features/dashboard/types";
import { useAppState } from "@react-native-community/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { formatToLocaleString } from "@utils/formatToLocaleString";
import moment from "moment-timezone";
import pupa from "pupa";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, SectionListData } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const assets = {
  errorIcon: require("@features/dashboard/assets/icons/error.png"),
  diaryIcon: require("@features/dashboard/assets/icons/diary.png"),
};

export const useStatsSection = (): SectionListData<DashboardItem> => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const getCovidStats = useCallback(
    (isManualRefresh?: boolean) => {
      dispatch(getCovidStatistics(isManualRefresh));
    },
    [dispatch],
  );

  const statsExpire = useSelector(selectExpires);
  const lastFetchedStats = useSelector(selectLastFetched);

  const getCovidStatsIfExpired = useCallback(() => {
    const expiry = moment(statsExpire);
    if (moment() > expiry) {
      getCovidStats();
    }
  }, [getCovidStats, statsExpire]);
  useFocusEffect(getCovidStatsIfExpired);

  const appState = useAppState();
  useEffect(() => {
    if (appState === "active") {
      getCovidStatsIfExpired();
    }
  }, [appState, getCovidStatsIfExpired]);

  const stats = useSelector(selectStats);
  const statsAreLoading = useSelector(selectStatsAreLoading);
  const statsError = useSelector(selectStatsError);
  const statsEmpty = useSelector(selectStatsEmpty);

  const statsAccessibilityLabel = useCallback(
    ({ dailyChange, url, value, subtitle }: StatItem) => {
      if (!dailyChange) {
        return undefined;
      }

      const template =
        dailyChange >= 0
          ? t("screens:dashboard:cards:stats:increase")
          : t("screens:dashboard:cards:stats:decrease");

      const change =
        typeof dailyChange === "string"
          ? formatToLocaleString(dailyChange)
          : pupa(template, [formatToLocaleString(dailyChange)]);

      const hint = url
        ? t("screens:dashboard:cards:stats:linkAccessibilityHint")
        : "";

      return [formatToLocaleString(value), subtitle, change, hint].join(" ");
    },
    [t],
  );

  const statsSections = useMemo<DashboardItem[]>(() => {
    if (statsError) {
      return [
        {
          headerImage: assets.errorIcon,
          title: "",
          description: t("screens:dashboard:sections:stats:error"),
          backgroundColor: errorCardBackground,
          onPress: undefined,
          isError: true,
        },
      ];
    } else if (statsAreLoading) {
      return ["statsLoading", "statsLoading", "statsLoading"];
    } else if (statsEmpty) {
      return [];
    }
    return (
      stats?.dashboardItems
        .map((group) =>
          group.map((item: StatItem, index: number) => ({
            headerImage:
              item.icon || require("@features/dashboard/assets/icons/scan.png"),
            title: item.value,
            description: item.subtitle,
            isLink: item.url ? true : false,
            onPress: item.url
              ? () => {
                  item.url && Linking.openURL(item.url);
                }
              : undefined,
            isGrouped: index > 0,
            isConnected: group.length > 1,
            accessibilityHint: item.url
              ? t("screens:dashboard:sections:stats:accessibilityHint")
              : undefined,
            accessibilityLabel: statsAccessibilityLabel(item),
            backgroundColor: item.backgroundColor,
            isStatistic: true,
            dailyChange: item.dailyChange,
            dailyChangeIsGood: item.dailyChangeIsGood,
          })),
        )
        .reduce((acc, val) => acc.concat(val), []) || []
    );
  }, [
    stats,
    statsAreLoading,
    statsError,
    statsAccessibilityLabel,
    statsEmpty,
    t,
  ]);

  return useMemo<SectionListData<DashboardItem>>(
    () => ({
      title: t("screens:dashboard:sections:stats:title"),
      subTitle: moment(lastFetchedStats).format("hh:mm A, DD MMMM YYYY"),
      data: statsSections,
      ctaTitle: t("screens:dashboard:sections:stats:refresh"),
      ctaAccessibilityTitle: t(
        "screens:dashboard:sections:stats:refreshAccessibility",
      ),
      ctaCallback: () => {
        getCovidStats(true);
      },
      footer: statsEmpty ? "" : t("screens:dashboard:sections:stats:footer"),
      footerUrl: stats?.sourceUrl,
      footerUrlDisplay: stats?.sourceDisplay,
    }),
    [lastFetchedStats, statsSections, statsEmpty, stats, getCovidStats, t],
  );
};
