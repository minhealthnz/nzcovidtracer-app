import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import DatePicker from "react-native-date-picker";
import styled from "styled-components/native";

import { useInputGroup } from "../molecules/InputGroup";
import { DatePickerProps } from "./DatePicker";
import { Text } from "./Text";

const Label = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryBlack};
  margin-bottom: ${grid}px;
  text-align: left;
`;

const DisclaimerText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold-italic"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryGray};
  margin-bottom: 8px;
`;

const ErrorText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.red};
`;

const PickerView = styled.View`
  margin-bottom: ${grid2x}px;
  align-items: center;
`;

export function DatePickerIOS(props: DatePickerProps) {
  const { t } = useTranslation();
  const {
    onDateChange,
    clearErrorMessage,
    justDate,
    errorMessage,
    dateTime,
    label: title,
    maximumDate,
    minimumDate,
    minuteInterval,
    info,
  } = props;

  const [date, setDate] = useState(new Date(dateTime));

  const onDatePickerChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate ?? date;
    setDate(currentDate);
    onDateChange(currentDate.getTime());
    clearErrorMessage?.();
    Keyboard.dismiss();
    onFocus();
  };

  const { onFocus } = useInputGroup(undefined, () => {
    Keyboard.dismiss();
    return true;
  });

  return (
    <>
      <Label>{`${title} (${t("common:required")})`}</Label>
      {info && <DisclaimerText>{info}</DisclaimerText>}
      <PickerView>
        <DatePicker
          testID="dateTimePicker"
          date={date}
          mode={justDate ? "date" : "datetime"}
          onDateChange={onDatePickerChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          minuteInterval={minuteInterval}
        />
        {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </PickerView>
    </>
  );
}
