import { RemoteInfoBlock } from "@components/molecules/RemoteInfoBlock";
import {
  RemoteCardData,
  RemoteInfoBlockData,
  RemotePanelData,
  RemoteSectionListData,
} from "@components/types";
import { grid3x } from "@constants";
import React, { useCallback, useMemo } from "react";
import {
  ImageSourcePropType,
  SectionListData,
  SectionListRenderItemInfo,
} from "react-native";

import { ErrorBanner } from "./ErrorBanner";
import { ListPlaceHolder } from "./ListPlaceHolder";
import { RemoteCard } from "./RemoteCard";
import { RemotePanel } from "./RemotePanel";
import { SectionHeader } from "./SectionHeader";
import { SectionList } from "./SectionList";
import { VerticalSpacing } from "./VerticalSpacing";

export interface RemoteSectionListProps {
  data: RemoteSectionListData;
  showPlaceholder?: boolean;
  error?: ErrorData;
  onRefresh?(): void;
  refreshing?: boolean;
}

export interface ErrorData {
  icon: ImageSourcePropType;
  title: string;
  body: string;
}

export interface ErrorItem extends ErrorData {
  isError: true;
}

type ItemType =
  | RemoteCardData
  | RemotePanelData
  | RemoteInfoBlockData
  | ErrorItem;

export function RemoteSectionList({
  data,
  showPlaceholder,
  onRefresh,
  refreshing,
  error,
}: RemoteSectionListProps) {
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<ItemType>) => {
      if ("isError" in item) {
        return (
          <ErrorBanner icon={item.icon} title={item.title} body={item.body} />
        );
      }
      switch (item.component) {
        case "Card":
          return <RemoteCard data={item} />;
        case "Panel":
          return <RemotePanel data={item} />;
        case "InfoBlock":
          return <RemoteInfoBlock data={item} />;
      }
    },
    [],
  );

  const renderSectionHeader = useCallback(({ section }) => {
    const title = section.title;
    return title && <SectionHeader title={title} />;
  }, []);

  const renderSectionFooter = useCallback(({ section }) => {
    return section.data.length === 0 ? null : (
      <VerticalSpacing height={grid3x} />
    );
  }, []);

  const sections = useMemo(() => {
    const results: SectionListData<ItemType>[] = [...data.sections];
    if (error != null) {
      const errorItem: ErrorItem = { ...error, isError: true };
      const errorSection = {
        data: [errorItem],
      };
      results.splice(0, 0, errorSection);
    }
    return results;
  }, [error, data.sections]);

  if (showPlaceholder && sections.length === 0) {
    return <ListPlaceHolder />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
