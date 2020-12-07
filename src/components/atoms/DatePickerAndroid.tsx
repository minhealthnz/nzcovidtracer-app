import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useInputGroup } from "../molecules/InputGroup";
import { DatePickerMode, DatePickerProps } from "./DatePicker";
import { DummyInput } from "./DummyInput";

const formatDateOnly = "DD MMMM YYYY";
const formateDateTime = "DD MMMM YYYY hh:mm A";

export function DatePickerAndroid(props: DatePickerProps) {
  const {
    dateTime,
    onDateChange,
    clearErrorMessage,
    justDate,
    label: title,
    maximumDate,
    minimumDate,
    minuteInterval,
  } = props;

  const { t } = useTranslation();

  const [date, setDate] = useState(new Date(dateTime));
  const [mode, setMode] = useState<DatePickerMode>("date");
  const [isShown, setIsShown] = useState(false);

  const [isAutoFocus, setIsAutoFocus] = useState(false);

  const { focusNext } = useInputGroup(undefined, () => {
    Keyboard.dismiss();
    focus();
    return true;
  });

  const onDatePickerChange = useCallback(
    (_event: Event, selectedDate: Date | undefined) => {
      if (!selectedDate) {
        setIsShown(false);
        return;
      }
      if (!justDate && mode === "date") {
        setIsShown(false);
        setDate(selectedDate);
        setMode("time");
        setIsShown(true);
      } else {
        setIsShown(false);
        setDate(selectedDate);
        onDateChange(selectedDate.getTime());
        if (isAutoFocus) {
          focusNext();
        }
      }
      clearErrorMessage?.();
    },
    [clearErrorMessage, focusNext, isAutoFocus, justDate, mode, onDateChange],
  );

  const showMode = useCallback((currentMode: DatePickerMode) => {
    setMode(currentMode);
    setIsShown(true);
  }, []);

  const showDatePicker = useCallback(() => {
    setIsAutoFocus(false);
    showMode("date");
  }, [showMode]);

  const focus = useCallback(() => {
    setIsAutoFocus(true);
    showMode("date");
  }, [showMode]);

  const accessibilityLabel =
    title +
    " " +
    moment(dateTime).format(justDate ? formatDateOnly : formateDateTime);

  return (
    <>
      <TouchableOpacity
        onPress={showDatePicker}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t("accessibility:datePicker:selectDateAndTime")}
      >
        <DummyInput
          label={title}
          value={moment(dateTime).format(
            justDate ? formatDateOnly : formateDateTime,
          )}
          required="required"
          errorMessage={props.errorMessage}
        />
      </TouchableOpacity>
      {isShown && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="spinner"
          onChange={onDatePickerChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          minuteInterval={minuteInterval}
        />
      )}
    </>
  );
}
