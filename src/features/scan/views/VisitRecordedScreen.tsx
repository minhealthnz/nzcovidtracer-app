import { InputGroup, Text, TextInput } from "@components/atoms";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { editEntry } from "@features/diary/reducer";
import { DiaryEntry } from "@features/diary/types";
import useEntry from "@hooks/diary/useEntry";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { detailsValidation } from "@validations/validations";
import { TabScreen } from "@views/screens";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { ScanScreen } from "../screens";
import { ScanStackParamList } from "./ScanNavigator";

const assets = {
  tickSmall: require("@assets/images/tick-small.png"),
};

const DateTimeText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryGray};
`;

const EntryName = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  padding-top: 3px;
  margin-top: ${grid}px;
`;

const Divider = styled.View`
  width: 100%;
  background-color: ${colors.divider};
  height: 1px;
  margin: 11px 0 ${grid2x}px 0;
`;

const schema = yup.object().shape({
  details: detailsValidation,
});

interface Props
  extends StackScreenProps<ScanStackParamList, ScanScreen.Recorded> {}

export function VisitRecordedScreen(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [details, setDetails] = useState<string>();
  const [detailsError, setDetailsError] = useState<string>("");

  const entryId = props.route.params.id;
  const diaryEntry = useEntry(entryId);

  const canEditDetails = diaryEntry.type === "scan";

  const handleDonePress = () => {
    if (canEditDetails) {
      handleEditSubmit();
    } else {
      props.navigation.pop();
    }
  };

  const handleEditSubmit = () => {
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
  };

  const inputGroupRef = useRef<InputGroupRef | null>(null);

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

  if (diaryEntry == null) {
    return null;
  }

  const currentMoment = moment(diaryEntry.startDate);

  return (
    <FormV2
      headerImage={assets.tickSmall}
      headerBackgroundColor={colors.green}
      buttonText={t("screens:visitRecorded:doneButton")}
      buttonTestID="visitRecorded:done"
      onButtonPress={handleDonePress}
      keyboardAvoiding={true}
    >
      <DateTimeText>
        {`${currentMoment.format("D MMMM YYYY")} at ${currentMoment.format(
          "h:mm A",
        )}`}
      </DateTimeText>
      <EntryName testID="visitRecorded:name">{diaryEntry.name}</EntryName>
      {canEditDetails && (
        <>
          <Divider />
          <InputGroup>
            <TextInput
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
    </FormV2>
  );
}
