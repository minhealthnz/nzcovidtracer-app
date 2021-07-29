import { useInputGroup } from "@components/molecules/InputGroup";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid4x,
} from "@constants";
import React, { useMemo } from "react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { Requiredness } from "./InputWrapper";
import { Text } from "./Text";

const InputView = styled.TouchableOpacity`
  width: 100%;
  margin-bottom: ${grid4x}px;
`;

const Label = styled(Text)<{ marginBottom: number }>`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryBlack};
  margin-bottom: ${(props) => props.marginBottom}px;
  text-align: left;
`;

const TextView = styled.View<{ errorMessage?: string }>`
  flex-direction: row;
  border-width: 1px;
  border-color: ${(props) =>
    props.errorMessage ? colors.red : colors.darkGrey};
  color: ${colors.black};
  width: 100%;
  margin-bottom: ${grid}px;
  background-color: ${colors.lightGrey};
  align-items: center;
`;

const TextStyled = styled(Text)`
  flex: 1;
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  padding-vertical: ${grid2x}px;
  padding-horizontal: ${grid}px;
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

export interface DummyProps {
  label?: string;
  info?: string;
  required?: Requiredness;
  value: string;
  errorMessage?: string;
  renderIcon?: React.ReactNode;
  isAccessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onPress?: () => void;
  identifier?: string;
}

// TODO use InputWrapper
export function DummyInput(props: DummyProps) {
  const { t } = useTranslation();
  const {
    label,
    required,
    value,
    info,
    errorMessage,
    renderIcon,
    isAccessible,
    accessibilityLabel,
    accessibilityHint,
    onPress,
    identifier,
  } = props;

  const inputRef = useRef<any>(null);

  // Require this to scroll to the input upon error.
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

  const labelHint = useMemo(() => {
    if (!required) {
      return "";
    }

    switch (required) {
      case "optional":
        return `(${t("common:optional")})`;
      case "recommended":
        return `(${t("common:recommended")})`;
      case "required":
        return `(${t("common:required")})`;
    }
  }, [required, t]);

  return (
    <InputView
      onPress={onPress}
      accessible={isAccessible === false ? isAccessible : true}
      accessibilityLabel={accessibilityLabel || [label, labelHint].join(" ")}
      accessibilityHint={accessibilityHint}
      ref={inputRef}
    >
      {!!label && (
        <Label marginBottom={info ? 4 : grid}>{`${label} ${labelHint}`}</Label>
      )}
      {info && <DisclaimerText>{info}</DisclaimerText>}
      <TextView errorMessage={errorMessage}>
        {!!renderIcon && renderIcon}
        <TextStyled>{value}</TextStyled>
      </TextView>
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputView>
  );
}
