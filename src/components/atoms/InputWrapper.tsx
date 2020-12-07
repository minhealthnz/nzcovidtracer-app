import { colors, fontFamilies, fontSizes, grid, grid4x } from "@constants";
import pupa from "pupa";
import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, findNodeHandle, Text } from "react-native";
import styled from "styled-components/native";

export type Requiredness = "required" | "optional" | "recommended";

const InputView = styled.View<{ disabled?: boolean; marginBottom?: number }>`
  width: 100%;
  margin-bottom: ${(props) => props.marginBottom ?? grid4x}px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const Label = styled(Text)<{ marginBottom?: number }>`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryBlack};
  margin-bottom: ${(props) => props.marginBottom ?? grid}px;
  text-align: left;
`;

const InfoText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold-italic"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryGray};
  margin-bottom: ${grid}px;
`;

const ErrorText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.red};
`;

export interface InputWrapperProps {
  label?: string;
  info?: string;
  required?: Requiredness;
  disabled?: boolean;
  errorMessage?: string;
  clearErrorMessage?: () => void;
  children: Element;
  marginBottom?: number;
}

export interface InputWrapperRef {
  accessibilityFocus(): void;
}

function _InputWrapper(props: InputWrapperProps, ref: Ref<InputWrapperRef>) {
  const { t } = useTranslation();
  const { label, info, required, disabled, errorMessage, marginBottom } = props;

  useImperativeHandle(ref, () => ({
    accessibilityFocus() {
      if (labelRef.current == null) {
        return;
      }
      const handle = findNodeHandle(labelRef.current);
      if (handle != null) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    },
  }));

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

  const labelRef = useRef<Text | null>(null);

  const accessibilityLabel = errorMessage
    ? pupa(t("accessibility:textFieldLabel"), [
        props.label,
        labelHint,
        errorMessage,
      ])
    : props.label;

  const accessibilityHint = props.info
    ? t("accessibility:textFieldHint2")
    : t("accessibility:textFieldHint1");

  return (
    <InputView disabled={disabled} marginBottom={marginBottom}>
      {!!label && (
        <Label
          ref={labelRef}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          marginBottom={info ? 4 : undefined}
        >{`${label} ${labelHint}`}</Label>
      )}
      {!!info && (
        <InfoText accessible accessibilityLabel={`Information ${info}`}>
          {info}
        </InfoText>
      )}
      {props.children}
      {!!errorMessage && (
        // not being able to remove focus issue on ErrorText element.
        <ErrorText accessible={false}>{errorMessage}</ErrorText>
      )}
    </InputView>
  );
}

export const InputWrapper = forwardRef(_InputWrapper);
