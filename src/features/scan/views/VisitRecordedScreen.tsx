import {
  InputGroup,
  Text,
  TextInput,
  VerticalSpacing,
} from "@components/atoms";
import { FocusAwareStatusBar } from "@components/atoms/FocusAwareStatusBar";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid3x,
} from "@constants";
import { editEntry } from "@features/diary/reducer";
import { DiaryScreen } from "@features/diary/screens";
import { selectCountActiveDays } from "@features/diary/selectors";
import { DiaryEntry } from "@features/diary/types";
import useEntry from "@hooks/diary/useEntry";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { detailsValidation } from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { useDebouncedCallback } from "use-debounce";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { DiaryPercentage } from "../components/DiaryPercentage";
import { ScanScreen } from "../screens";

const DateTimeText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryBlack};
`;

const EntryName = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  padding-top: 7px;
  margin-top: ${grid}px;
`;

const Divider = styled.View`
  width: 100%;
  background-color: ${colors.white};
  height: 1px;
  margin: 11px 0 ${grid2x}px 0;
`;

const TitleBox = styled.View`
  flex-direction: column;
  flex: 1;
  padding-left: 12px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
`;

const ManualDetailsTitle = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
`;

const ManualDetailsText = styled(Text)`
  margin-top: 3px;
  font-size: ${fontSizes.normal}px;
  padding-bottom: 30px;
`;

const HeaderContainer = styled.View`
  padding: ${grid}px ${grid3x}px 0 ${grid3x}px;
  background-color: ${colors.green};
`;

const schema = yup.object().shape({
  details: detailsValidation,
});

const assets = {
  successTick: require("@assets/icons/success-tick.png"),
};

interface Props
  extends StackScreenProps<MainStackParamList, ScanScreen.Recorded> {}

export function VisitRecordedScreen(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [details, setDetails] = useState<string>();
  const [detailsError, setDetailsError] = useState<string>("");

  const entryId = props.route.params.id;
  const diaryEntry = useEntry(entryId);
  const manualDetails =
    diaryEntry.details || t("screens:visitRecorded:notProvided");

  const canEditDetails = diaryEntry.type === "scan";

  const numberOfDiaryEntries = useSelector(selectCountActiveDays);
  const totalEntryDay = 14;

  const handleEditSubmit = useCallback(() => {
    Keyboard.dismiss();
    schema
      .validate({ details })
      .then(() => {
        if (details) {
          const entryToSave: DiaryEntry = {
            ...diaryEntry,
            details,
          };
          recordAnalyticEvent(AnalyticsEvent.ScanNoteAdded);
          dispatch(editEntry(entryToSave));
        }
        props.navigation.navigate(TabScreen.RecordVisit);
      })
      .catch((error: yup.ValidationError) => {
        setDetailsError(t(error.message));

        inputGroupRef.current?.focusError("details");
      });
  }, [details, diaryEntry, props.navigation, t, dispatch]);

  const handleDonePress = useDebouncedCallback(
    useCallback(() => {
      if (canEditDetails) {
        handleEditSubmit();
      } else {
        props.navigation.pop();
      }
    }, [props.navigation, canEditDetails, handleEditSubmit]),
    2000,
    {
      leading: true,
      trailing: false,
    },
  );

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.green,
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [props.navigation]);

  useFocusEffect(
    useCallback(() => {
      if (numberOfDiaryEntries === totalEntryDay) {
        recordAnalyticEvent(AnalyticsEvent.EntryComplete);
      }
    }, [numberOfDiaryEntries]),
  );

  useFocusEffect(
    useCallback(() => {
      switch (diaryEntry.type) {
        case "scan":
          recordAnalyticEvent(AnalyticsEvent.EntryPass);
          break;
        case "manual":
          recordAnalyticEvent(AnalyticsEvent.EntryPassManual);
          break;
      }
    }, [diaryEntry.type]),
  );

  useAccessibleTitle();

  const handleDiaryPercentagePress = useDebouncedCallback(
    useCallback(() => {
      // Remove recorded page from stack
      props.navigation.pop();
      props.navigation.navigate(DiaryScreen.Diary);
    }, [props.navigation]),
    2000,
    {
      leading: true,
      trailing: false,
    },
  );

  if (diaryEntry == null) {
    return null;
  }

  const currentMoment = moment(diaryEntry.startDate);

  return (
    <FormV2
      buttonText={t("screens:visitRecorded:doneButton")}
      buttonAccessibilityHint={t("screens:visitRecorded:doneHint")}
      buttonTestID="visitRecorded:done"
      onButtonPress={handleDonePress}
      keyboardAvoiding={true}
      backgroundColor={colors.lightGrey}
      padding={0}
      buttonSnapToBottom={true}
    >
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.green}
      />
      <HeaderContainer>
        <TitleContainer>
          <Image source={assets.successTick} />
          <TitleBox>
            <DateTimeText>
              {`${currentMoment.format(
                "D MMMM YYYY",
              )} at ${currentMoment.format("h:mm A")}`}
            </DateTimeText>
            <EntryName testID="visitRecorded:name">{diaryEntry.name}</EntryName>
          </TitleBox>
        </TitleContainer>
        {canEditDetails && (
          <>
            <Divider />
            <VerticalSpacing height={10} />
            <InputGroup>
              <TextInput
                infoTextStyle={styles.infoText}
                identifier="details"
                label={t("screens:visitRecorded:addDetails")}
                required="optional"
                info={t("screens:visitRecorded:detailsDescription")}
                value={details}
                multiline={true}
                numberOfLines={2}
                onChangeText={setDetails}
                errorMessage={detailsError}
                clearErrorMessage={() => setDetailsError("")}
              />
            </InputGroup>
          </>
        )}
        {diaryEntry.type === "manual" && (
          <>
            <Divider />
            <ManualDetailsTitle>Details</ManualDetailsTitle>
            <ManualDetailsText
              fontFamily={diaryEntry.details ? "open-sans" : "open-sans-italic"}
            >
              {manualDetails}
            </ManualDetailsText>
          </>
        )}
      </HeaderContainer>
      <View style={{ padding: grid3x, backgroundColor: colors.lightGrey }}>
        <DiaryPercentage onPress={handleDiaryPercentagePress} />
      </View>
    </FormV2>
  );
}

const styles = StyleSheet.create({
  infoText: {
    color: colors.primaryBlack,
  },
});
