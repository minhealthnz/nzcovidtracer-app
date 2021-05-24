import { RemoteSectionList } from "@components/atoms/RemoteSectionList";
import { SwitchContext } from "@features/dashboard/components/SwitchProvider";
import { selectInternetReachable } from "@features/device/selectors";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useAppState } from "@react-native-community/hooks";
import { useFocusEffect } from "@react-navigation/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useDefaultSections } from "../hooks/useDefaultSections";
import { getData } from "../reducer";
import { selectData, selectError, selectIsExpired } from "../selectors";

export function Resources() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const remoteData = useSelector(selectData);
  const defaultSections = useDefaultSections();
  const data = remoteData.sections.length === 0 ? defaultSections : remoteData;

  const error = useSelector(selectError);
  const isExpired = useSelector(selectIsExpired);

  const errorSection = useMemo(() => {
    if (isExpired) {
      return {
        icon: require("@assets/icons/no-connection.png"),
        title: t("screens:resources:errors:expired:title"),
        body: t("screens:resources:errors:expired:body"),
      };
    }

    switch (error) {
      case "unknown":
        // Only show unknown errors if data is empty
        return {
          icon: require("@assets/images/error-small.png"),
          title: t("screens:resources:errors:unknown:title"),
          body: t("screens:resources:errors:unknown:body"),
        };
      case "network":
        return {
          icon: require("@assets/icons/no-connection.png"),
          title: t("screens:resources:errors:network:title"),
          body: t("screens:resources:errors:network:body"),
        };
      default:
        return undefined;
    }
  }, [isExpired, error, t]);

  const refresh = useCallback(() => {
    dispatch(getData());
  }, [dispatch]);

  const pullToRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getData()).finally(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  useFocusEffect(refresh);

  const appState = useAppState();

  useEffect(() => {
    if (appState === "active") {
      refresh();
    }
  }, [appState, refresh]);

  const internetReachable = useSelector(selectInternetReachable);

  useEffect(() => {
    // Refresh if has error and internet has become reachable
    if (internetReachable && Boolean(error)) {
      refresh();
    }
  }, [internetReachable, error, refresh]);

  const { scrollIndex } = useContext(SwitchContext);

  // Refresh after scrolling to resources
  useEffect(() => {
    if (scrollIndex === 1) {
      refresh();
    }
  }, [scrollIndex, refresh]);

  return (
    <RemoteSectionList
      showPlaceholder={true}
      error={errorSection}
      data={data}
      onRefresh={pullToRefresh}
      refreshing={refreshing}
    />
  );
}
