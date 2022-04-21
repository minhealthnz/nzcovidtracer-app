import { useInputGroup } from "@components/molecules/InputGroup";
import { colors, fontFamilies, fontSizes, grid, grid4x } from "@constants";
import React, { useCallback, useRef } from "react";
import styled from "styled-components/native";

import { Requiredness } from "./InputWrapper";
import { Text } from "./Text";

const InputView = styled.View`
  width: 100%;
  margin-bottom: ${grid4x}px;
  border-bottom-width: 1px;
  border-color: ${colors.platinum};
`;

const Label = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryBlack};
  text-align: left;
`;

const TextView = styled.View<{ errorMessage?: string }>`
  flex-direction: row;
  color: ${colors.black};
  width: 100%;
  margin-bottom: ${grid}px;
  background-color: ${colors.white};
  align-items: center;
`;

const TextStyled = styled(Text)`
  flex: 1;
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-bold"]};
`;

const ButtonText = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-bold"]};
  color: ${colors.primaryBlack};
  text-decoration: underline;
`;

const ErrorText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.red};
`;

export interface FormTextFieldProps {
  label?: string;
  info?: string;
  required?: Requiredness;
  value: string;
  errorMessage?: string;
  renderIcon?: React.ReactNode;
  isAccessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  buttonAccessibilityHint?: string;
  onPress?: () => void;
  identifier?: string;
  buttonText?: string;
}

export function FormLocationConfirmField(props: FormTextFieldProps) {
  const {
    label,
    value,
    errorMessage,
    renderIcon,
    onPress,
    identifier,
    accessibilityLabel,
    buttonAccessibilityHint,
    buttonText,
  } = props;

  const inputRef = useRef<any>(null);

  useInputGroup(
    identifier,
    useCallback(() => {
      if (!inputRef.current) {
        return false;
      }
      inputRef?.current?.focus();
      return true;
    }, []),
  );

  return (
    <InputView ref={inputRef}>
      {!!label && <Label>{`${label}`}</Label>}
      <TextView errorMessage={errorMessage}>
        {!!renderIcon && renderIcon}
        <TextStyled accessibilityLabel={accessibilityLabel}>{value}</TextStyled>
        {!!onPress && (
          <ButtonText
            accessibilityLabel={buttonText}
            accessibilityHint={buttonAccessibilityHint}
            accessibilityRole="button"
            onPress={onPress}
          >
            {buttonText}
          </ButtonText>
        )}
      </TextView>
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputView>
  );
}
