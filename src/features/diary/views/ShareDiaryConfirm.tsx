import {
  Button,
  InputGroup,
  TextInput,
  VerticalSpacing,
} from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { SectionList } from "@components/atoms/SectionList";
import { presets } from "@components/atoms/TextInput";
import { FormV2Handle, Heading } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid3x,
} from "@constants";
import { navigationMaxDuration } from "@navigation/constants";
import { debounce } from "@navigation/debounce";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useBackButton } from "@navigation/hooks/useBackButton";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid } from "@reduxjs/toolkit";
import { dataRequestCodeValidation } from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import moment from "moment-timezone";
import pupa from "pupa";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import * as yup from "yup";

import { DiaryItem, groupByStartDate } from "../hooks/useDiarySections";
import { useShareDiaryRequest } from "../hooks/useShareDiaryRequest";
import { shareDiary } from "../reducer";
import { DiaryScreen } from "../screens";
import { DiaryEntry } from "../types";

const TipContainer = styled.View`
  margin-horizontal: ${grid2x}px;
  margin-top: ${grid2x}px;
  padding: ${grid2x}px;
  background-color: ${colors.lightYellow};
`;

const TipText = styled.Text`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans"]};
  line-height: ${fontSizes.xLarge}px;
`;

const TipTextBold = styled.Text`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-bold"]};
  line-height: ${fontSizes.xLarge}px;
`;

const SummaryTitle = styled.Text`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
`;

const ListItemTitle = styled.Text`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  flex: 3;
`;

const ListItemText = styled.Text`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  margin-right: ${grid2x}px;
  color: ${colors.primaryGray};
  flex: 1;
`;

const HeaderContainer = styled.View`
  background-color: ${colors.white};
  padding-horizontal: ${grid2x}px;
`;

const Container = styled.View`
  flex: 1;
`;

const ChangeEntries = styled.Text`
  line-height: 20px;
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-bold"]};
  text-decoration-line: underline;
`;

const Separator = styled.View`
  background-color: ${colors.platinum};
  height: 1px;
  margin-horizontal: ${grid2x}px;
`;

const ButtonContainer = styled.View`
  padding: ${grid2x}px;
  padding-bottom: ${grid2x}px;
  background-color: ${colors.white};
`;

const SectionTitle = styled.Text`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  line-height: 16px;
  color: ${colors.primaryGray};
  margin-horizontal: ${grid2x}px;
  margin-bottom: ${grid}px;
  margin-top: ${grid3x}px;
`;

const ListItemView = styled.View`
  padding: ${grid2x}px;
  margin-horizontal: ${grid2x}px;
  background-color: ${colors.white};
  flex-direction: row;
  align-items: center;
`;

export interface ShareDiaryConfirmProps
  extends StackScreenProps<MainStackParamList, DiaryScreen.ShareDiaryConfirm> {}

const schema = yup.object().shape({
  dataRequestCode: dataRequestCodeValidation,
});

const keyExtractor = (item: DiaryItem, index: number) => {
  return typeof item === "object"
    ? item.locationId + item.id
    : index.toString();
};

export function ShareDiaryConfirm(props: ShareDiaryConfirmProps) {
  const [requestId] = useState<string>(nanoid());
  const [isLoading, setIsLoading] = useState(false);
  const [dataRequestCode, setDataRequestCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const shareDiaryRequest = useShareDiaryRequest(requestId);
  const formRef = useRef<FormV2Handle | null>(null);
  const inputGroupRef = useRef<InputGroupRef | null>(null);

  const selectedItems = useMemo(() => {
    return props?.route?.params?.items || [];
  }, [props?.route?.params?.items]);

  useAccessibleTitle();
  const handleBackPressed = () => {
    return isLoading;
  };
  useBackButton(props.navigation, { handleBackPressed });

  // Get data sections grouped and with it's title
  const sections = useMemo(() => {
    const groupedItems = groupByStartDate(selectedItems);
    return groupedItems.map((section) => {
      const dt = moment(section[0].startDate);
      return {
        title: dt.format(
          `dddd, D MMMM${dt.year() === moment().year() ? " YYYY" : ""}`,
        ),
        startOfDay: dt.startOf("day"),
        data: section,
      };
    });
  }, [selectedItems]);

  useEffect(() => {
    if (!shareDiaryRequest?.fulfilled) {
      return;
    }

    props.navigation.navigate(DiaryScreen.DiaryShared);

    const handle = setTimeout(() => {
      setIsLoading(false);
    }, navigationMaxDuration);

    return () => clearTimeout(handle);
  }, [shareDiaryRequest, props.navigation]);

  useEffect(() => {
    if (shareDiaryRequest?.error) {
      if (shareDiaryRequest.error.isToast) {
        formRef.current?.showToast(t(shareDiaryRequest.error.message));
      } else {
        setCodeError(t(shareDiaryRequest.error.message));
      }
      setIsLoading(false);
    }
  }, [shareDiaryRequest, t]);

  const cleanErrors = () => {
    setCodeError("");
    formRef.current?.hideToast();
  };

  const onSharePress = debounce(() => {
    Keyboard.dismiss();
    cleanErrors();

    schema
      .validate({ dataRequestCode })
      .then(() => {
        setIsLoading(true);
        dispatch(
          shareDiary({
            requestId,
            code: dataRequestCode,
            items: selectedItems,
          }),
        );
      })
      .catch((error: yup.ValidationError) => {
        if (error.message) {
          setCodeError(t(error.message));
          inputGroupRef.current?.focusError("dataRequestCode");
        }
      });
  });

  const lastDay = useMemo(() => {
    return moment(sections[0].startOfDay).format("D MMMM YYYY");
  }, [sections]);

  const firstDay = useMemo(() => {
    return moment(sections[sections.length - 1].startOfDay).format(
      "D MMMM YYYY",
    );
  }, [sections]);

  const diarySummaryText = useMemo(() => {
    const diaryEntryText =
      selectedItems.length > 1
        ? t("screens:shareDiaryConfirm:diaryEntries")
        : t("screens:shareDiaryConfirm:aDiaryEntry");
    const wasOrWere = selectedItems.length > 1 ? "were" : "was";
    return pupa(t("screens:shareDiaryConfirm:createdOn"), [
      diaryEntryText,
      wasOrWere,
    ]);
  }, [selectedItems.length, t]);

  const renderListHeader = useMemo(() => {
    return (
      <>
        <HeaderContainer>
          <Heading style={styles.heading}>
            {t("screens:shareDiaryConfirm:title")}
          </Heading>
          <InputGroup ref={inputGroupRef}>
            <TextInput
              {...presets.alphaNumericCode}
              identifier="dataRequestCode"
              testID="shareDiary:dataRequestCode"
              label={t("screens:shareDiaryConfirm:dataRequestCode")}
              value={dataRequestCode}
              onChangeText={(value: string) => setDataRequestCode(value.trim())}
              required="required"
              errorMessage={codeError}
              clearErrorMessage={() => setCodeError("")}
              info={t("screens:shareDiaryConfirm:dataRequestCodeInfo")}
              onSubmitEditing={onSharePress}
              marginBottom={grid2x}
            />
          </InputGroup>
        </HeaderContainer>
        <TipContainer>
          <SummaryTitle>
            {t("screens:shareDiaryConfirm:summaryTitle")}
          </SummaryTitle>
          {groupByStartDate(selectedItems).length === 1 ? (
            <TipText>
              {t("screens:shareDiaryConfirm:youWillBeUploading")}{" "}
              <TipTextBold>{selectedItems.length}</TipTextBold>{" "}
              {diarySummaryText} <TipTextBold>{firstDay}</TipTextBold>
            </TipText>
          ) : (
            <TipText>
              {t("screens:shareDiaryConfirm:youWillBeUploading")}{" "}
              <TipTextBold>
                {selectedItems.length}{" "}
                {t("screens:shareDiaryConfirm:diaryEntries")}{" "}
              </TipTextBold>
              {t("screens:shareDiaryConfirm:across")}{" "}
              <TipTextBold>
                {sections.length}{" "}
                {t(
                  `screens:shareDiaryConfirm:${
                    sections.length === 1 ? "day" : "days"
                  }`,
                )}{" "}
              </TipTextBold>
              {t("screens:shareDiaryConfirm:period")}{" "}
              <TipTextBold>
                {firstDay} {t("screens:shareDiaryConfirm:to")} {lastDay}
              </TipTextBold>
            </TipText>
          )}
          <VerticalSpacing height={grid} />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t(
              "screens:shareDiaryConfirm:changeEntriesAccessibility",
            )}
            accessibilityHint={t("screens:shareDiaryConfirm:changeEntriesHint")}
            onPress={() => props.navigation.goBack()}
          >
            <ChangeEntries>
              {t("screens:shareDiaryConfirm:changeEntries")}
            </ChangeEntries>
          </TouchableOpacity>
        </TipContainer>
      </>
    );
  }, [
    codeError,
    dataRequestCode,
    firstDay,
    lastDay,
    onSharePress,
    props.navigation,
    sections.length,
    diarySummaryText,
    selectedItems,
    t,
  ]);

  const renderItem = useCallback((itemInfo) => {
    const item: DiaryEntry = itemInfo.item;
    return (
      <ListItemView>
        <ListItemText>{moment(item.startDate).format("h:mma")}</ListItemText>
        <ListItemTitle>{item.name}</ListItemTitle>
      </ListItemView>
    );
  }, []);

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return <SectionTitle>{title}</SectionTitle>;
  }, []);

  const buttonContainer = useMemo(
    () => (
      <>
        <Divider />
        <ButtonContainer>
          <Button
            text={t("screens:shareDiaryConfirm:share")}
            onPress={onSharePress}
            isLoading={isLoading}
            accessibilityLabel={t(
              "screens:shareDiaryConfirm:shareAccessibility",
            )}
          />
        </ButtonContainer>
      </>
    ),
    [isLoading, onSharePress, t],
  );

  return (
    <Container>
      <SectionList
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={true}
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={Separator}
        onEndReachedThreshold={8}
        initialNumToRender={15}
        windowSize={61}
        ListHeaderComponent={renderListHeader}
      />
      {buttonContainer}
    </Container>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 12,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.lightGrey,
    paddingBottom: grid2x,
  },
});
