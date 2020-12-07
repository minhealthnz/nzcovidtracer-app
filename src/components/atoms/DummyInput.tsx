import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid4x,
} from "@constants";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { Requiredness } from "./InputWrapper";
import { Text } from "./Text";

const InputView = styled.View`
  width: 100%;
  margin-bottom: ${grid4x}px;
`;

const Label = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryBlack};
  margin-bottom: ${grid}px;
  text-align: left;
`;

const TextStyled = styled(Text)<{ errorMessage?: string }>`
  border-width: 1px;
  border-color: ${(props) =>
    props.errorMessage ? colors.red : colors.darkGrey};
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  padding-horizontal: ${grid}px;
  padding-vertical: ${grid2x}px;
  color: ${colors.black};
  width: 100%;
  margin-bottom: ${grid}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.lightGrey};
`;

const DisclaimerText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold-italic"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryGray};
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
}

// TODO use InputWrapper
export function DummyInput(props: DummyProps) {
  const { t } = useTranslation();
  const { label, required, value, info, errorMessage } = props;

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
    <InputView>
      {!!label && <Label>{`${label} ${labelHint}`}</Label>}

      <TextStyled errorMessage={errorMessage}>{value}</TextStyled>
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      {info && <DisclaimerText>{info}</DisclaimerText>}
    </InputView>
  );
}
