import { DatePicker, InputGroup, TextInput } from "@components/atoms";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { grid } from "@constants";
import { selectUserId } from "@domain/user/selectors";
import { addEntry } from "@features/diary/reducer";
import { DiaryEntry } from "@features/diary/types";
import { ScanScreen } from "@features/scan/screens";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { calcCheckInMaxDate, calcCheckInMinDate } from "@utils/checkInDate";
import {
  detailsValidation,
  placeOrActivityValidation,
  startDateValidation,
} from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { DiaryScreen } from "../screens";

const { logError } = createLogger("AddManualDiaryEntry.tsx");

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.AddEntryManually> {}

const schema = yup.object().shape({
  name: placeOrActivityValidation,
  startDate: startDateValidation,
  details: detailsValidation,
});

export function AddManualDiaryEntry(props: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const date = props.route.params?.startDate;

  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [startDate, setStartDate] = useState<number>(
    date || new Date().getTime(),
  );
  const [dateError, setDateError] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [detailsError, setDetailsError] = useState<string>("");

  const minimumDate = useRef(calcCheckInMinDate());
  const maximumDate = useRef(calcCheckInMaxDate());

  const cleanErrorMessages = () => {
    setNameError("");
    setDateError("");
    setDetailsError("");
  };

  const onDetailsChange = (text: string) => {
    setDetails(text);
  };

  const userId = useSelector(selectUserId);

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.Manual);
    }, []),
  );

  const saved = useRef(false);

  const onSavePress = useCallback(() => {
    if (saved.current) {
      return;
    }

    Keyboard.dismiss();

    if (userId == null) {
      logError("Cannot find userId [screen=AddManualDiaryEntry]");
      return;
    }
    const newEntry: DiaryEntry = {
      name,
      userId,
      details,
      id: nanoid(),
      startDate: startDate,
      type: "manual",
    };
    cleanErrorMessages();
    schema
      .validate(newEntry, { abortEarly: false })
      .then(() => {
        return dispatch(
          addEntry({
            entry: newEntry,
          }),
        );
      })
      .then(unwrapResult)
      .then(() => {
        saved.current = true;
        props.navigation.replace(ScanScreen.Recorded, {
          id: newEntry.id,
        });

        if (details.length > 0) {
          recordAnalyticEvent(AnalyticsEvent.ManualNoteAdded);
        }
      })
      .catch((error: yup.ValidationError | Error) => {
        if (error instanceof yup.ValidationError && error.inner) {
          error.inner.forEach((item) => {
            switch (item.path) {
              case "name":
                setNameError(t(item.message));
                break;
              case "startDate":
                setDateError(t(item.message));
                break;
              case "details":
                setDetailsError(t(item.message));
                break;
            }
          });

          inputGroupRef.current?.focusError(...error.inner.map((x) => x.path));
        } else {
          logError("Failed to save entry", error);
          props.navigation.navigate(ScanScreen.ScanNotRecorded);
        }
      });
  }, [props.navigation, t, dispatch, name, details, startDate, userId]);

  useAccessibleTitle();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  return (
    <FormV2
      buttonTestID="addManualDiaryEntry:save"
      buttonText={t("screens:addManualDiaryEntry:save")}
      onButtonPress={onSavePress}
      keyboardAvoiding={true}
    >
      <InputGroup ref={inputGroupRef}>
        <TextInput
          identifier="name"
          testID="addManualDiaryEntry:placeOrActivity"
          label={t("screens:addManualDiaryEntry:placeOrActivity")}
          value={name}
          onChangeText={setName}
          required="required"
          errorMessage={nameError}
          clearErrorMessage={() => setNameError("")}
        />
        <DatePicker
          dateTime={startDate}
          onDateChange={setStartDate}
          errorMessage={dateError}
          clearErrorMessage={() => setDateError("")}
          label={t("screens:addManualDiaryEntry:datePicker")}
          maximumDate={maximumDate.current}
          minimumDate={minimumDate.current}
          minuteInterval={5}
        />
        <TextInput
          identifier="details"
          testID="addManualDiaryEntry:details"
          label={t("screens:addManualDiaryEntry:details")}
          value={details}
          onChangeText={onDetailsChange}
          info={t("screens:addManualDiaryEntry:disclaimer")}
          required="optional"
          errorMessage={detailsError}
          clearErrorMessage={() => setDetailsError("")}
          multiline={true}
          numberOfLines={4}
          returnKeyType="default"
          marginBottom={grid}
        />
      </InputGroup>
    </FormV2>
  );
}
