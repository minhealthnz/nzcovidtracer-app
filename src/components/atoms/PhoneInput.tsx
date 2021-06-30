import { colors } from "@constants";
import React, { useCallback, useRef, useState } from "react";
import { Image, StyleSheet, TextInput as BaseTextInput } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import styled from "styled-components/native";

import { useInputGroup } from "../molecules/InputGroup";
import {
  InputWrapper,
  InputWrapperProps,
  InputWrapperRef,
} from "./InputWrapper";
import { presets, TextInputInner } from "./TextInput";

const CountryContainer = styled.View<{
  hasError: boolean;
}>`
  align-items: center;
  border-width: 1px;
  justify-content: center;
  border-color: ${(props) => (props.hasError ? colors.red : colors.darkGrey)};
  margin-right: 8px;
  margin-bottom: 8px;
  background-color: ${colors.lightGrey};
`;

const TextInput = styled(TextInputInner)`
  flex: 0;
  flex-grow: 1;
  min-width: 50%;
`;

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DropDownContainer = styled.View`
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0);
`;

const styles = StyleSheet.create({
  containerButton: {
    paddingLeft: 8,
    minHeight: 56,
    justifyContent: "center",
    paddingRight: 32,
  },
});

type PhoneInputProps = Omit<
  InputWrapperProps & {
    phone: string;
    onChangePhone(phone: string): void;
    countryCode: CountryCode;
    onChangeCountry(country: Country): void;
    preferredCountries?: CountryCode[];
    identifier?: string;
  },
  "children"
>;

export function PhoneInput({
  countryCode,
  phone,
  onChangeCountry,
  onChangePhone,
  preferredCountries,
  identifier,
  ...wrapperProps
}: PhoneInputProps) {
  const inputRef = useRef<BaseTextInput | null>(null);
  const [hasFocus, setHasFocus] = useState(false);

  const { focusNext, isLast, onFocus } = useInputGroup(
    identifier,
    useCallback(() => {
      if (!inputRef.current) {
        return false;
      }
      inputRef.current.focus();

      return true;
    }, []),
    useCallback(() => {
      inputWrapperRef.current?.accessibilityFocus();
    }, []),
  );

  const hasError = Boolean(wrapperProps.errorMessage);

  const handleChangeCountry = (country: Country) => {
    onChangeCountry(country);
    wrapperProps.clearErrorMessage?.();
  };

  const handleChangeText = (value: string) => {
    onChangePhone(value);
    wrapperProps.clearErrorMessage?.();
  };

  const handleFocus = useCallback(() => {
    onFocus();
    setHasFocus(true);
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  // Fix can submit multiple times
  const handleSubmit = useCallback(() => {
    focusNext();
  }, [focusNext]);

  const accessibilityLabel = wrapperProps.label;

  const inputWrapperRef = useRef<InputWrapperRef | null>(null);

  return (
    <InputWrapper ref={inputWrapperRef} {...wrapperProps}>
      <Container>
        <CountryContainer hasError={hasError}>
          <CountryPicker
            containerButtonStyle={styles.containerButton}
            countryCode={countryCode}
            withCallingCode
            withCallingCodeButton
            preferredCountries={preferredCountries}
            onSelect={handleChangeCountry}
          />
          <DropDownContainer pointerEvents="none">
            <Image
              source={require("@assets/icons/dropdown.png")}
              width={24}
              height={24}
            />
          </DropDownContainer>
        </CountryContainer>
        <TextInput
          accessible
          accessibilityLabel={accessibilityLabel}
          {...presets.phone}
          ref={inputRef}
          hasError={hasError}
          hasFocus={hasFocus}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={isLast ? "done" : "next"}
          blurOnSubmit={false}
        >
          {phone}
        </TextInput>
      </Container>
    </InputWrapper>
  );
}
