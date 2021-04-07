import { Disclaimer } from "@components/molecules/Disclaimer";
import { colors } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { AddEntryButton } from "../components/AddEntryButton";
import { DiaryEntryListItem } from "../components/DiaryEntryListItem";
import { usePaginationSession } from "../hooks/usePaginationSession";
import { DiaryScreen } from "../screens";

const keyExtractor = (diaryEntry: DiaryEntry) => diaryEntry.id;

const Separator = styled.View`
  background-color: ${colors.divider};
  height: 1px;
  width: 100%;
`;

const DiaryList = styled(FlatList as new () => FlatList<DiaryEntry>)`
  background-color: ${colors.white};
`;

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.Diary> {}

export function Diary(props: Props) {
  const onEntryPress = useCallback(
    (entry: DiaryEntry) => () => {
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

  const handleLoadMore = () => {
    loadNextPage();
  };

  const handleRefresh = () => {
    refresh();
  };

  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item: entry }) => (
      <DiaryEntryListItem entry={entry} onPress={onEntryPress(entry)} />
    ),
    [onEntryPress],
  );

  const handleAddEntry = useCallback(() => {
    props.navigation.navigate(DiaryScreen.AddEntryManually);
  }, [props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight() {
        return <AddEntryButton handleAddEntry={handleAddEntry} />;
      },
    });
  }, [props.navigation, handleAddEntry, t]);
  const renderFooter = useCallback(() => {
    return <Disclaimer text={t("components:diaryDisclaimer:disclaimer")} />;
  }, [t]);

  useAccessibleTitle();

  // TODO add a refresh control
  return (
    <DiaryList
      contentContainerStyle={styles.scrollViewContent}
      scrollEnabled={true}
      data={diaryEntries}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={renderFooter}
      ListFooterComponentStyle={styles.listFooter}
      onEndReachedThreshold={8}
      onEndReached={handleLoadMore}
      initialNumToRender={15}
      windowSize={61}
      onRefresh={handleRefresh}
      refreshing={querying}
    />
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  listFooter: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
