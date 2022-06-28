import { Text, VerticalSpacing } from "@components/atoms";
import { HeaderButton } from "@components/atoms/HeaderButton";
import { ListPlaceHolder } from "@components/atoms/ListPlaceHolder";
import { SectionList } from "@components/atoms/SectionList";
import { Toast } from "@components/atoms/Toast";
import {
  ActionSheet,
  ActionSheetSectionItems,
} from "@components/molecules/ActionSheet";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { colors, fontFamilies, grid2x } from "@constants";
import { query } from "@db/entities/checkInItem";
import { selectUserId } from "@domain/user/selectors";
import {
  DiaryEntry,
  ExportDiaryEntry,
  MergeEntryError,
} from "@features/diary/types";
import useCurrentDate from "@features/enfExposure/hooks/useCurrentDate";
import { LocationScreen } from "@features/locations/screens";
import { ReminderCard } from "@features/reminder/components/ReminderCard";
import { useToast } from "@hooks/useToast";
import { getOffsetInMins } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import moment from "moment-timezone";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  Alert,
  findNodeHandle,
  ScrollView,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
} from "react-native";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";
import { Dirs, FileSystem } from "react-native-file-access";
import Modal from "react-native-modal";
import Share from "react-native-share";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { recordAnalyticEvent } from "../../../analytics";
import { DiarySectionHeader } from "../components/DiarySectionHeader";
import { DiarySectionItem } from "../components/DiarySectionItem";
import { DiaryEvent } from "../events";
import {
  DiaryItem,
  DiarySectionData,
  useDiarySections,
} from "../hooks/useDiarySections";
import { usePaginationSession } from "../hooks/usePaginationSession";
import { mapAddDiaryEntry, mapExportDiaryEntry } from "../mappers";
import { mergeEntries, setMergeEntryStatus } from "../reducer";
import { DiaryScreen } from "../screens";
import { selectMergeEntryStatus } from "../selectors";

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

const ImportingDiaryText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${grid2x}px;
  padding-top: ${grid2x}px;
  padding-horizontal: ${grid2x}px;
`;

const assets = {
  importDiary: require("@assets/icons/import-diary.png"),
  exportDiary: require("@assets/icons/export-diary.png"),
  shareDiary: require("@assets/icons/share-diary.png"),
};

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.Diary> {}

export function Diary(props: Props) {
  const [isActionSheetOpened, setIsActionSheetOpened] =
    useState<boolean>(false);

  const [isImporting, setIsImporting] = useState<boolean>(false);

  const userId = useSelector(selectUserId);
  const mergeStatus = useSelector(selectMergeEntryStatus);
  const isMergeSucceeded = mergeStatus?.status === "succeeded";

  const showPlaceHolder = isImporting || mergeStatus?.status === "loading";

  const handleEntryPress = useCallback(
    (entry: DiaryEntry) => {
      props.navigation.navigate(DiaryScreen.DiaryEntry, { id: entry.id });
    },
    [props.navigation],
  );

  const { refresh, loadNextPage, querying, diaryEntries } =
    usePaginationSession();

  const dispatch = useAppDispatch();

  const setMergeStatusToDefault = useCallback(() => {
    dispatch(setMergeEntryStatus({ status: "idle" }));
  }, [dispatch]);

  const [toastMessage, setToastMessage] = useToast(
    5000,
    setMergeStatusToDefault,
  );

  useEffect(() => {
    if (mergeStatus?.message) {
      setToastMessage(mergeStatus?.message);
    }
  }, [mergeStatus, setToastMessage]);

  const currentDate = useCurrentDate();
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const { t } = useTranslation();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          accessibilityLabel={t("screens:diary:options")}
          accessibilityHint={t("screens:diary:optionsAccessibilityHint")}
          text={t("screens:diary:options")}
          style={styles.manageButton}
          onPress={() => setIsActionSheetOpened(true)}
        />
      ),
    });
  }, [props.navigation, t]);

  const handleAddEntry = useCallback(
    (startDate: number) => {
      // Need to check for DayLight Saving changes as datetime is always evaluated
      // from start of day - i.e. 12am. However daylight saving kicks in 2am. This
      // needs to be handled manually.
      const isStartDateDST = moment(startDate).isDST();
      startDate =
        startDate.valueOf() +
        currentDate.getHours() * hour +
        currentDate.getMinutes() * minute -
        getOffsetInMins() * minute;

      // Get the offset date and check if that is in Daylight saving mode.
      const isNewDateDST = moment(startDate).isDST();

      // For the day it changes, check whether to add or remove the hour.
      if (isStartDateDST !== isNewDateDST) {
        startDate = isNewDateDST
          ? startDate.valueOf() - 60 * minute
          : startDate.valueOf() + 60 * minute;
      }

      props.navigation.navigate(LocationScreen.PlaceOrActivity, {
        startDate: startDate,
      });
    },
    [props.navigation, currentDate, hour, minute],
  );

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

  const handleImportError = useCallback(
    (importErrorType: MergeEntryError) => {
      if (importErrorType === "InvalidFileType") {
        dispatch(
          setMergeEntryStatus({
            status: "failed",
            message: t("screens:diary:invalidFileType"),
          }),
        );
      } else if (importErrorType === "InvalidFileContent") {
        dispatch(
          setMergeEntryStatus({
            status: "failed",
            message: t("screens:diary:invalidFileContent"),
          }),
        );
      }
      recordAnalyticEvent(DiaryEvent.DiaryImportFailed);
      setIsImporting(false);
    },
    [dispatch, t],
  );

  const exportDiary = useCallback(async () => {
    const exportDiaryEntry = await query(userId, new Date(), "ALL").then(
      (result) => result.map(mapExportDiaryEntry),
    );

    const filePath = `${Dirs.DocumentDir}/${moment().format(
      "YYYY-MM-DD",
    )}.diary`;

    const exportOptions = {
      url: `file:///${filePath}`,
      failOnCancel: false,
    };

    await FileSystem.writeFile(filePath, JSON.stringify(exportDiaryEntry));

    await Share.open(exportOptions)
      .then(async () => {
        // Delete the file from the file system
        await FileSystem.unlink(filePath);
      })
      .catch((err) => {
        Alert.alert(err.message);
      });
  }, [userId]);

  const importDiary = useCallback(async () => {
    if (userId == null) {
      return;
    }

    const res: DocumentPickerResponse = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
      copyTo: "documentDirectory",
    });

    setIsImporting(true);

    if (res.fileCopyUri != null) {
      const copyURISplit = res.fileCopyUri.split("/");
      const fileName = copyURISplit[copyURISplit.length - 1];
      const folder = copyURISplit[copyURISplit.length - 2];
      const filePath = `${Dirs.DocumentDir}/${folder}/${fileName}`;

      const correctFileTypeRecieved = /\.(diary)$/i.test(fileName);

      if (!correctFileTypeRecieved) {
        handleImportError("InvalidFileType");
        return;
      }

      try {
        const diaries: ExportDiaryEntry[] = JSON.parse(
          await FileSystem.readFile(filePath),
        );

        if (diaries.length === 0) {
          handleImportError("InvalidFileContent");
          return;
        }

        const uploadDiaries = diaries.map(mapAddDiaryEntry(userId));

        dispatch(mergeEntries(uploadDiaries)).then(() => {
          setIsImporting(false);
        });
      } catch {
        handleImportError("InvalidFileContent");
      }

      await FileSystem.unlink(filePath);
    }
  }, [userId, dispatch, handleImportError]);

  const handleImport = useCallback(() => {
    setIsActionSheetOpened(false);
    // Document picker modal closes the parent modal therefore execute importDiary function after parent modal is closed
    setTimeout(() => {
      importDiary();
    }, 700);
  }, [importDiary]);

  const handleExport = useCallback(() => {
    setIsActionSheetOpened(false);
    // Share modal closes the parent modal therefore execute exportDiary function after parent modal is closed
    setTimeout(() => {
      exportDiary();
    }, 700);
  }, [exportDiary]);

  const exportDiaryConfirmation = useCallback(() => {
    Alert.alert(
      t("screens:diary:exportAlertTitle"),
      t("screens:diary:exportAlertBody"),
      [
        {
          text: t("screens:diary:cancel"),
          onPress: () => {
            // Cancel export diary action, returning undefined on purpose
            return undefined;
          },
          style: "cancel",
        },
        {
          text: t("screens:diary:export"),
          onPress: handleExport,
        },
      ],
      { cancelable: false },
    );
  }, [handleExport, t]);

  const handleShareDiary = useCallback(() => {
    setIsActionSheetOpened(false);
    props.navigation.navigate(DiaryScreen.ShareDiary);
  }, [props.navigation]);

  const actionSheetSectionItems: ActionSheetSectionItems[] = useMemo(() => {
    return [
      {
        title: t("screens:diary:transferDiary"),
        data: [
          {
            title: t("screens:diary:exportDiary"),
            subTitle: t("screens:diary:saveYourDiary"),
            onPress: exportDiaryConfirmation,
            icon: assets.exportDiary,
          },
          {
            title: t("screens:diary:importDiary"),
            subTitle: t("screens:diary:transferEntries"),
            onPress: handleImport,
            icon: assets.importDiary,
          },
        ],
      },
      {
        title: t("screens:diary:tracerCalls"),
        data: [
          {
            title: t("screens:diary:shareDiary"),
            subTitle: t("screens:diary:helpTracers"),
            onPress: handleShareDiary,
            icon: assets.shareDiary,
          },
        ],
      },
    ];
  }, [exportDiaryConfirmation, handleImport, handleShareDiary, t]);

  const placeHolderRef = useRef(null);

  useEffect(() => {
    const reactTag = findNodeHandle(placeHolderRef.current);
    if (showPlaceHolder && reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }, [placeHolderRef, showPlaceHolder]);

  return (
    <>
      {showPlaceHolder ? (
        <ScrollView
          accessible
          accessibilityLabel={t("screens:diary:importingDiary")}
          ref={placeHolderRef}
        >
          <ImportingDiaryText>
            {t("screens:diary:importingDiary")}
          </ImportingDiaryText>
          <ListPlaceHolder />
        </ScrollView>
      ) : (
        <>
          {toastMessage && (
            <Toast
              text={toastMessage}
              backgroundColor={isMergeSucceeded ? colors.green : undefined}
              fontColor={isMergeSucceeded ? colors.primaryBlack : undefined}
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
            onEndReached={handleLoadMore}
            initialNumToRender={15}
            windowSize={61}
            onRefresh={handleRefresh}
            refreshing={querying}
            style={styles.sectionListContainer}
            ListHeaderComponent={ReminderCard}
          />
          <Modal
            isVisible={isActionSheetOpened}
            style={styles.modalView}
            onBackButtonPress={() => setIsActionSheetOpened(false)}
          >
            <ActionSheet
              title={t("screens:diary:diaryOptions")}
              items={actionSheetSectionItems}
              onDisMiss={() => setIsActionSheetOpened(false)}
            />
          </Modal>
        </>
      )}
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
  manageButton: {
    paddingRight: 20,
  },
  modalView: {
    margin: 0,
    justifyContent: "flex-end",
  },
});
