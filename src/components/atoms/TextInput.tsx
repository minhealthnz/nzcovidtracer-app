import { colors, fontFamilies, fontSizes, grid } from "@constants";
import React, {
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as BaseTextInput,
  TextInputProps as TextInputBaseProps,
  TextInputSubmitEditingEventData,
} from "react-native";
import styled from "styled-components/native";

import { useInputGroup } from "../molecules/InputGroup";
import {
  InputWrapper,
  InputWrapperProps,
  InputWrapperRef,
} from "./InputWrapper";

export const TextInputInner = styled.TextInput<{
  numberOfLines?: number;
  hasError?: boolean;
  hasFocus?: boolean;
  multiline?: boolean;
  hasIcon?: boolean;
}>`
  border: 1px solid
    ${(props) =>
      props.hasError
        ? colors.red
        : props.hasFocus
        ? colors.primaryBlack
        : colors.darkGrey};
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  padding: ${grid}px;
  padding-left: ${(props) => (props.hasIcon ? 45 : grid)}px;
  color: ${colors.black};
  width: 100%;
  min-height: ${(props) =>
    props.numberOfLines ? 27 * (props.numberOfLines + 1) : 56}px;
  max-height: ${27 * 4}px;
  margin-bottom: ${grid}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.lightGrey};
  text-align-vertical: ${(props) => (props.multiline ? "top" : "center")};
`;

const IconView = styled.View`
  position: absolute;
  top: 35px;
  z-index: 1;
`;

type TextInputProps = Omit<
  TextInputBaseProps & InputWrapperProps,
  "children"
> & {
  identifier?: string;
  onNext?: () => void;
  renderIcon?: React.ReactNode;
};

export interface TextInputRef {
  focus(): void;
}

function _TextInput(props: TextInputProps, ref: Ref<TextInputRef>) {
  const inputRef = useRef<BaseTextInput | null>(null);
  const [hasFocus, setHasFocus] = useState(false);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  const {
    disabled,
    errorMessage,
    onChangeText,
    onSubmitEditing,
    clearErrorMessage,
    onNext,
    renderIcon,
  } = props;

  const onChange = (text: string) => {
    onChangeText?.(text);
    clearErrorMessage?.();
  };

  const { focusNext, isLast, onFocus } = useInputGroup(
    props.identifier,
    useCallback(() => {
      if (!inputRef.current || disabled) {
        return false;
      }
      inputRef.current.focus();
      return true;
    }, [disabled]),
    useCallback(() => {
      inputWrapperRef.current?.accessibilityFocus();
    }, []),
  );

  const handleFocus = useCallback(() => {
    onFocus();
    setHasFocus(true);
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  const hasError = Boolean(errorMessage);

  const handleSubmit = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      focusNext?.();
      onSubmitEditing?.(e);
    },
    [focusNext, onSubmitEditing],
  );

  const textInputProps: TextInputProps = props;

  const accessibilityLabel = props.label;

  const inputWrapperRef = useRef<InputWrapperRef | null>(null);

  return (
    <InputWrapper ref={inputWrapperRef} {...props}>
      <IconView>{renderIcon}</IconView>
      <TextInputInner
        {...textInputProps}
        accessible
        accessibilityLabel={accessibilityLabel}
        onChangeText={onChange}
        editable={!disabled}
        hasError={hasError}
        hasFocus={hasFocus}
        ref={inputRef}
        returnKeyType={props.returnKeyType ?? (isLast ? "done" : "next")}
        blurOnSubmit={false}
        onSubmitEditing={onNext ?? handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasIcon={!!renderIcon}
      />
    </InputWrapper>
  );
}

export const TextInput = forwardRef(_TextInput);

export const presets = {
  email: {
    keyboardType: "email-address",
    autoCorrect: false,
    autoCompleteType: "email",
    autoCapitalize: "none",
    textContentType: "emailAddress",
  },
  firstName: {
    autoCorrect: false,
    autoCompleteType: "name",
    autoCapitalize: "words",
    textContentType: "givenName",
  },
  lastName: {
    autoCorrect: false,
    autoCompleteType: "name",
    autoCapitalize: "words",
    textContentType: "familyName",
  },
  phone: {
    keyboardType: "phone-pad",
    autoCorrect: false,
    autoCompleteType: "tel",
    textContentType: "telephoneNumber",
  },
  numericCode: {
    keyboardType:
      Platform.OS === "ios" ? "numbers-and-punctuation" : "number-pad",
    autoCorrect: false,
    autoCompleteType: "off",
  },
  alphaNumericCode: {
    autoCorrect: false,
    autoCompleteType: "off",
    autoCapitalize: "characters",
  },
} as const;
