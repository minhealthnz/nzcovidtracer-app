import { Button, Text } from "@components/atoms";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { useRequest } from "@hooks/useRequest";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { DiaryEntryListItem } from "../components/DiaryEntryListItem";
import { usePaginationSession } from "../hooks/usePaginationSession";
import { copyDiary } from "../reducer";
import { DiaryScreen } from "../screens";
import { selectCopyDiary } from "../selectors";
import { DiaryEntry } from "../types";

const keyExtractor = (diaryEntry: DiaryEntry) => diaryEntry.id;

const Container = styled.View`
  padding: ${grid2x}px;
`;

const DiaryList = styled(FlatList as new () => FlatList<DiaryEntry>)`
  background-color: ${colors.white};
`;

const DiaryView = styled.View`
  flex: 1;
  background-color: #0f0;
  width: 100%;
`;

const Description = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  margin-bottom: ${grid}px;
`;

const EmailAddress = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  margin-bottom: ${grid2x}px;
`;

const Separator = styled.View`
  background-color: ${colors.lightGrey};
  height: 1px;
  width: 100%;
`;

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.ViewDiary> {}

export function ViewDiary(props: Props) {
  const { t } = useTranslation();
  const { userId, email, isOnboarding } = props.route.params;

  const dispatch = useDispatch();

  const anyCopyDiaryRequest = useSelector(selectCopyDiary);
  const { request: copyDiaryRequest, requestId } = useRequest(
    anyCopyDiaryRequest,
  );
  const copyDiaryFulfilled = useMemo(() => copyDiaryRequest?.fulfilled, [
    copyDiaryRequest,
  ]);
  const copyDiaryError = useMemo(() => copyDiaryRequest?.error, [
    copyDiaryRequest,
  ]);

  const onSubmitPress = useCallback(() => {
    dispatch(
      copyDiary({
        requestId,
        userId,
        isOnboarding,
        email,
      }),
    );
  }, [userId, email, isOnboarding, dispatch, requestId]);

  useEffect(() => {
    if (copyDiaryFulfilled) {
      props.navigation.replace(DiaryScreen.CopiedDiary, {
        email,
        isOnboarding,
      });
    }
  }, [
    props.navigation,
    copyDiaryRequest,
    copyDiaryFulfilled,
    email,
    isOnboarding,
  ]);

  useEffect(() => {
    if (copyDiaryError != null) {
      Alert.alert(copyDiaryError.message ?? t("errors:generic"));
    }
  }, [copyDiaryError, t]);

  const userIds = useMemo(() => [userId], [userId]);

  const { diaryEntries } = usePaginationSession(userIds);

  useAccessibleTitle();

  const renderFooter = useCallback(() => {
    return <Disclaimer text={t("components:diaryDisclaimer:disclaimer")} />;
  }, [t]);

  return (
    <>
      <DiaryView>
        <DiaryList
          contentContainerStyle={styles.scrollViewContent}
          scrollEnabled={true}
          data={diaryEntries}
          keyExtractor={keyExtractor}
          renderItem={({ item: entry }) => <DiaryEntryListItem entry={entry} />}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={renderFooter}
          ListFooterComponentStyle={styles.listFooter}
          onEndReachedThreshold={2}
        />
      </DiaryView>
      <Container>
        <Description maxFontSizeMultiplier={1.5}>
          {t("screens:viewDiary:descriptionP1")}
        </Description>
        <EmailAddress maxFontSizeMultiplier={1.5}>{email}</EmailAddress>
        <Button
          testID="viewDiary:submit"
          onPress={onSubmitPress}
          text={t("screens:viewDiary:submit")}
        />
      </Container>
    </>
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
