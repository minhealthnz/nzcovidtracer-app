import { Button, Text, VerticalSpacing } from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { ListPlaceHolder } from "@components/atoms/ListPlaceHolder";
import { SectionList } from "@components/atoms/SectionList";
import { Toast } from "@components/atoms/Toast";
import { Heading } from "@components/molecules/FormV2";
import { colors, grid2x, grid4x } from "@constants";
import { useToast } from "@hooks/useToast";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { forOwn, isEmpty } from "lodash";
import pupa from "pupa";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";

import { DiaryEntryListItem } from "../components/DiaryEntryListItem";
import { DiarySectionHeader } from "../components/DiarySectionHeader";
import { DiaryItem, DiarySectionData } from "../hooks/useDiarySections";
import { useEntireDiary } from "../hooks/useEntireDiary";
import { DiaryScreen } from "../screens";
import { DiaryEntry } from "../types";

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 20px;
  padding-horizontal: ${grid2x}px;
`;

const ListItemView = styled.View`
  padding-horizontal: ${grid2x}px;
`;

const Separator = styled.View`
  background-color: ${colors.platinum};
  height: 1px;
  margin-horizontal: ${grid2x}px;
`;

const Container = styled.View`
  flex: 1;
`;

const HeaderContainer = styled.View<{
  hasError?: boolean;
  toastHeight?: number;
}>`
  background-color: ${colors.white};
  margin-top: ${(props) =>
    props.hasError ? (props.toastHeight ? props.toastHeight : grid4x) : 0}px;
`;

export const ButtonContainer = styled.View`
  padding: ${grid2x}px;
  padding-bottom: ${grid2x}px;
  background-color: ${colors.white};
`;

export interface ShareDiaryListProps
  extends StackScreenProps<MainStackParamList, DiaryScreen.ShareDiaryList> {}

interface SelectedRow {
  checked: boolean;
  item: DiaryEntry;
}

const keyExtractor = (item: DiaryItem, index: number) => {
  return typeof item === "object"
    ? item.locationId + item.id
    : index.toString();
};

export function ShareDiaryList(props: ShareDiaryListProps) {
  const { t } = useTranslation();
  const [allButtonActive, setAllButtonActive] = useState<boolean>(false);
  const [last14ButtonActive, setLast14ButtonActive] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, SelectedRow>>(
    {},
  );
  const { sections, allEntries, loading } = useEntireDiary();
  const [toastMessage, setToastMessage] = useToast(5000);
  const [toastHeight, setToastHeight] = useState<number>(0);

  useAccessibleTitle();

  const checkLast14Button = useCallback(() => {
    let index = sections.findIndex((i) => i.showOldDiaryTitle);
    if (index <= 0) {
      index = sections.length;
    }
    let data: DiaryEntry[] = [];
    for (let i = 0; i < index; i++) {
      const section = sections[i];
      const sectionData = section.data as DiaryEntry[];
      data = [...data, ...sectionData];
    }

    const last14Selected = data.every(
      (i) => selectedRows[i.id] && selectedRows[i.id].checked,
    );

    const selectedRowsChecked = Object.values(selectedRows).filter(
      (i) => i.checked,
    );

    if (
      !isEmpty(data) &&
      last14Selected &&
      selectedRowsChecked.length === data.length
    ) {
      return true;
    } else {
      return false;
    }
  }, [sections, selectedRows]);

  useEffect(() => {
    if (!loading && !allButtonActive && !last14ButtonActive) {
      const checkedRows = Object.values(selectedRows).filter((i) => i.checked);
      if (!isEmpty(allEntries) && checkedRows.length === allEntries.length) {
        setAllButtonActive(true);
        setLast14ButtonActive(false);
      } else {
        const last14Selected = checkLast14Button();
        setAllButtonActive(false);
        setLast14ButtonActive(last14Selected);
      }
    }
  }, [
    allButtonActive,
    allEntries,
    allEntries.length,
    checkLast14Button,
    last14ButtonActive,
    loading,
    sections,
    selectedRows,
  ]);

  const onAllButtonPress = useCallback(() => {
    const rows: Record<string, SelectedRow> = {};
    const checked = !allButtonActive;
    sections.forEach((section) => {
      const data = section.data as DiaryEntry[];
      data.forEach((i) => {
        rows[i.id] = { checked, item: i };
      });
    });
    setSelectedRows((prevState) => ({
      ...prevState,
      ...rows,
    }));
    setAllButtonActive(checked);
    setLast14ButtonActive(false);
    setToastMessage(undefined);
  }, [allButtonActive, sections, setToastMessage]);

  const onLast14ButtonPress = useCallback(() => {
    const checked = !last14ButtonActive;
    let index = sections.findIndex((i) => i.showOldDiaryTitle);

    if (index <= 0) {
      index = sections.length;
    }

    const rows: Record<string, SelectedRow> = {};
    for (let i = 0; i < index; i++) {
      const section = sections[i];
      const data = section.data as DiaryEntry[];
      data.forEach((x) => {
        rows[x.id] = { checked, item: x };
      });
    }

    setSelectedRows((prevState) => {
      forOwn(prevState, (val) => {
        val.checked = false;
      });
      return {
        ...prevState,
        ...rows,
      };
    });

    setLast14ButtonActive(checked);
    setAllButtonActive(false);
    setToastMessage(undefined);
  }, [last14ButtonActive, sections, setToastMessage]);

  const onSelectDay = useCallback(
    (section: DiarySectionData, val: boolean) => {
      const data = section.data as DiaryEntry[];
      const sectionRows = {};

      data.forEach((i) => {
        selectedRows[i.id] = { checked: val, item: i };
      });

      setSelectedRows((prevState) => ({
        ...prevState,
        ...sectionRows,
      }));
      setLast14ButtonActive(false);
      setAllButtonActive(false);
      setToastMessage(undefined);
    },
    [selectedRows, setToastMessage],
  );

  const onCheckboxChange = useCallback(
    (item: DiaryEntry, val: boolean) => {
      setSelectedRows((prevState) => ({
        ...prevState,
        [item.id]: { checked: val, item },
      }));
      setLast14ButtonActive(false);
      setAllButtonActive(false);
      setToastMessage(undefined);
    },
    [setToastMessage],
  );

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<DiaryItem> }) => {
      const section = info.section as DiarySectionData;
      const data = section.data as DiaryEntry[];
      const allDataSelected = data.every(
        (i) => selectedRows[i.id] && selectedRows[i.id].checked,
      );
      return (
        <ListItemView>
          <DiarySectionHeader
            title={section.title}
            ctaTitle={
              isEmpty(section.data)
                ? undefined
                : t(
                    `screens:shareDiaryList:${
                      allDataSelected ? "unselectDay" : "selectDay"
                    }`,
                  )
            }
            ctaCallback={() => onSelectDay(section, !allDataSelected)}
            accessibilityLabel={t(
              `screens:shareDiaryList:${
                allDataSelected
                  ? "unselectDayAccessibilityLabel"
                  : "selectDayAccessibilityLabel"
              }`,
            )}
          />
        </ListItemView>
      );
    },
    [onSelectDay, selectedRows, t],
  );

  const renderSectionFooter = useCallback(
    (info: { section: SectionListData<DiaryItem> }) => {
      const section = info.section as DiarySectionData;
      const arr = [];
      if (isEmpty(section.data)) {
        arr.push(<Text key="noEntries">No entries</Text>);
      }

      if (section.isLastSection) {
        arr.push(<VerticalSpacing key="vSpacing" height={30} />);
      }

      return <ListItemView>{arr}</ListItemView>;
    },
    [],
  );

  const renderItem = useCallback(
    (itemInfo: SectionListRenderItemInfo<DiaryItem>) => {
      const item = itemInfo.item as DiaryEntry;
      const isChecked = selectedRows[item.id]?.checked;
      return (
        <ListItemView>
          <DiaryEntryListItem
            hideDate={true}
            hideDay={true}
            isChecked={selectedRows[item.id]?.checked}
            onCheckboxValChange={onCheckboxChange}
            entry={item}
            showCheckboxes={true}
            accessibilityLabel={pupa(t("screens:shareDiaryList:sectionItem"), [
              itemInfo.index + 1,
              itemInfo.section.data.length,
            ])}
            onEntryPress={() => onCheckboxChange(item, !isChecked)}
          />
        </ListItemView>
      );
    },
    [onCheckboxChange, selectedRows, t],
  );

  const renderListHeader = useMemo(() => {
    return (
      <HeaderContainer hasError={!!toastMessage} toastHeight={toastHeight}>
        <Heading style={styles.heading}>
          {t("screens:shareDiaryList:title")}
        </Heading>
        <ButtonsContainer>
          <Button
            text={t("screens:shareDiaryList:allDays")}
            onPress={onAllButtonPress}
            buttonColor={allButtonActive ? "yellow" : "white"}
            style={{ ...styles.button, ...styles.spaceRight }}
            textStyle={styles.buttonText}
            accessibilityLabel={t(
              `screens:shareDiaryList:${
                allButtonActive
                  ? "allDaysSelectedAccessibilityLabel"
                  : "allDaysAccessibilityLabel"
              }`,
            )}
            accessibilityHint={t(
              `screens:shareDiaryList:${
                allButtonActive
                  ? "allDaysSelectedAccessibilityHint"
                  : "allDaysAccessibilityHint"
              }`,
            )}
          />
          <Button
            text={t("screens:shareDiaryList:lastFourteen")}
            onPress={onLast14ButtonPress}
            buttonColor={last14ButtonActive ? "yellow" : "white"}
            style={{ ...styles.button, ...styles.spaceLeft }}
            textStyle={styles.buttonText}
            accessibilityLabel={t(
              `screens:shareDiaryList:${
                last14ButtonActive
                  ? "lastFourteenSelectedAccessibilityLabel"
                  : "lastFourteenAccessibilityLabel"
              }`,
            )}
            accessibilityHint={t(
              `screens:shareDiaryList:${
                last14ButtonActive
                  ? "lastFourteenSelectedAccessibilityHint"
                  : "lastFourteenAccessibilityHint"
              }`,
            )}
          />
        </ButtonsContainer>
      </HeaderContainer>
    );
  }, [
    allButtonActive,
    last14ButtonActive,
    onAllButtonPress,
    onLast14ButtonPress,
    t,
    toastMessage,
    toastHeight,
  ]);

  const onContinue = useCallback(() => {
    const selected = Object.values(selectedRows);
    const items: DiaryEntry[] = [];
    selected.forEach((row) => {
      if (row.checked) {
        items.push(row.item);
      }
    });
    if (items.length === 0) {
      setToastMessage(t("screens:shareDiaryList:error"));
    } else {
      props.navigation.navigate(DiaryScreen.ShareDiaryConfirm, { items });
    }
  }, [props.navigation, selectedRows, setToastMessage, t]);

  const buttonContainer = useMemo(
    () => (
      <>
        <Divider />
        <ButtonContainer>
          <Button
            text={t("screens:shareDiary:continue")}
            onPress={onContinue}
            accessibilityLabel={t("screens:shareDiary:continue")}
            accessibilityHint={t("screens:shareDiary:continue")}
          />
        </ButtonContainer>
      </>
    ),
    [onContinue, t],
  );

  return (
    <Container>
      {loading ? (
        <ListPlaceHolder numberOfItems={10} />
      ) : (
        <>
          {toastMessage && (
            <Toast
              text={t("screens:shareDiaryList:error")}
              backgroundColor={colors.toastRed}
              fontColor={colors.white}
              setToastHeight={(height) => setToastHeight(height)}
            />
          )}
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
            initialNumToRender={15}
            windowSize={61}
            refreshing={loading}
            ListHeaderComponent={renderListHeader}
          />
          {buttonContainer}
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.lightGrey,
    padding: -grid2x,
  },
  heading: {
    marginTop: 12,
    paddingHorizontal: grid2x,
  },
  description: {
    paddingHorizontal: grid2x,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  buttonActive: {
    flex: 1,
  },
  spaceLeft: {
    marginLeft: 5,
  },
  spaceRight: {
    marginRight: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
