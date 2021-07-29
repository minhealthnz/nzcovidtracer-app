import { VerticalSpacing } from "@components/atoms";
import { SectionList } from "@components/atoms/SectionList";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { colors, grid2x } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import useCurrentDate from "@features/enfExposure/hooks/useCurrentDate";
import { ReminderCard } from "@features/reminder/components/ReminderCard";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";

import { DiarySectionHeader } from "../components/DiarySectionHeader";
import { DiarySectionItem } from "../components/DiarySectionItem";
import {
  DiaryItem,
  DiarySectionData,
  useDiarySections,
} from "../hooks/useDiarySections";
import { usePaginationSession } from "../hooks/usePaginationSession";
import { DiaryScreen } from "../screens";

const keyExtractor = (item: DiaryItem, index: number) => {
  return typeof item === "object"
    ? item.locationId + item.id
    : index.toString();
};

const Separator = styled.View`
  background-color: ${colors.platinum};
  height: 1px;
  margin-horizontal: ${grid2x}px;
`;

const ListItemView = styled.View`
  padding-horizontal: ${grid2x}px;
`;

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.Diary> {}

export function Diary(props: Props) {
  const handleEntryPress = useCallback(
    (entry: DiaryEntry) => {
      props.navigation.navigate(DiaryScreen.DiaryEntry, { id: entry.id });
    },
    [props.navigation],
  );

  const {
    refresh,
    loadNextPage,
    querying,
    diaryEntries,
  } = usePaginationSession();

  const currentDate = useCurrentDate();
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const handleAddEntry = useCallback(
    (startDate: number) => {
      startDate =
        startDate.valueOf() +
        currentDate.getHours() * hour +
        currentDate.getMinutes() * minute;

      props.navigation.navigate(DiaryScreen.AddEntryManually, {
        startDate,
      });
    },
    [props.navigation, currentDate, hour, minute],
  );

  const { t } = useTranslation();

  const { sections } = useDiarySections(diaryEntries, handleAddEntry, t);

  const handleLoadMore = () => {
    loadNextPage();
  };

  const handleRefresh = () => {
    refresh();
  };

  const renderItem = useCallback(
    (itemInfo: SectionListRenderItemInfo<DiaryItem>) => {
      const section = itemInfo.section as DiarySectionData;
      const startOfDay = section.startOfDay;
      const item = itemInfo.item;

      return (
        <ListItemView>
          <DiarySectionItem
            item={item}
            startOfDay={startOfDay}
            onEntryPress={handleEntryPress}
            handleAddEntry={handleAddEntry}
          />
        </ListItemView>
      );
    },
    [handleEntryPress, handleAddEntry],
  );

  useAccessibleTitle();

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<DiaryItem> }) => {
      const section = info.section as DiarySectionData;
      return (
        <ListItemView>
          <DiarySectionHeader
            title={section.title}
            showOldDiaryTitle={section.showOldDiaryTitle}
            ctaTitle={section.ctaTitle}
            ctaCallback={section.ctaCallback}
            accessibilityLabel={t(
              "screens:diary:addNewManualEntryAccessibilityLabel",
            )}
          />
        </ListItemView>
      );
    },
    [t],
  );

  const renderSectionFooter = useCallback(
    (info: { section: SectionListData<DiaryItem> }) => {
      const section = info.section as DiarySectionData;
      return section.isLastSection ? <VerticalSpacing height={30} /> : null;
    },
    [],
  );

  return (
    <>
      <SectionList
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={true}
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        ItemSeparatorComponent={Separator}
        onEndReachedThreshold={8}
        onEndReached={handleLoadMore}
        initialNumToRender={15}
        windowSize={61}
        onRefresh={handleRefresh}
        refreshing={querying}
        style={styles.sectionListContainer}
        ListHeaderComponent={ReminderCard}
      />
      <Disclaimer text={t("components:diaryDisclaimer:disclaimer")} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  sectionListContainer: {
    paddingRight: 0,
    paddingLeft: 0,
  },
});
