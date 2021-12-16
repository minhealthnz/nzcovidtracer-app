import { colors, fontFamilies, fontSizes } from "@constants";
import { getOffsetInMins } from "@lib/helpers";
import moment from "moment-timezone";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Modal } from "react-native";
import DatePicker from "react-native-date-picker";
import styled from "styled-components/native";

import { DatePickerProps } from "./DatePicker";
import { DummyInput } from "./DummyInput";
import { Text } from "./Text";

const formatDateOnly = "DD MMMM YYYY";
const formateDateTime = "DD MMMM YYYY hh:mm A";

const DoneText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
`;

const ModalContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const ModalCloseBackground = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(255, 255, 237, 0.5);
  align-items: center;
  justify-content: center;
`;

const ModalMain = styled.View`
  z-index: 20;
  shadow-radius: 4px;
  elevation: 5;
  overflow: hidden;
  background-color: ${colors.white};
  border-radius: 4px;
`;

const ModalButtonContainer = styled.View`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  align-items: flex-end;
  background-color: ${colors.yellow};
`;

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
    info,
  } = props;

  const { t } = useTranslation();

  const [date, setDate] = useState(new Date(dateTime));
  const [isShown, setIsShown] = useState(false);

  const onDatePickerChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate ?? date;
    setDate(currentDate);
    onDateChange(currentDate.getTime());
    clearErrorMessage?.();
    Keyboard.dismiss();
  };

  const accessibilityLabel =
    title +
    " " +
    moment(dateTime).format(justDate ? formatDateOnly : formateDateTime);

  const offset = getOffsetInMins() * 60000;

  return (
    <>
      <DummyInput
        info={info}
        onPress={() => setIsShown(true)}
        label={title}
        value={moment(date.getTime() + offset).format(
          justDate ? formatDateOnly : formateDateTime,
        )}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t("accessibility:datePicker:selectDateAndTime")}
        isAccessible={false}
        required="required"
        errorMessage={props.errorMessage}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isShown}
        onRequestClose={() => {
          setIsShown(false);
        }}
      >
        <ModalContainer>
          <ModalCloseBackground
            activeOpacity={1}
            onPress={() => setIsShown(false)}
          >
            <ModalMain>
              <DatePicker
                testID="dateTimePicker"
                date={date}
                mode={justDate ? "date" : "datetime"}
                onDateChange={onDatePickerChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                minuteInterval={minuteInterval}
              />
              <ModalButtonContainer>
                <DoneText>Done</DoneText>
              </ModalButtonContainer>
            </ModalMain>
          </ModalCloseBackground>
        </ModalContainer>
      </Modal>
    </>
  );
}
