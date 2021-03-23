import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid3x,
  grid4x,
} from "@constants";
import { useToast } from "@hooks/useToast";
import { useHeaderHeight } from "@react-navigation/stack";
import React, {
  createContext,
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Image,
  ImageSourcePropType,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  TextStyle,
  View,
} from "react-native";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

import Button from "../atoms/Button";
import { FormHeader } from "../atoms/FormHeader";
import { FormHeaderProps } from "../atoms/FormHeader";
import { SecondaryButton } from "../atoms/SecondaryButton";
import { Text } from "../atoms/Text";
import { Toast } from "../atoms/Toast";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.white};
`;

const Banner = styled.View<{ color?: string }>`
  width: 100%;
  background-color: ${(props) => props.color};
  padding-horizontal: ${grid3x}px;
  padding-vertical: ${grid}px;
  flex-direction: row;
  align-items: center;
`;

const BannerText = styled(Text)<{ color?: string }>`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  margin-left: ${grid}px;
  color: ${(props) => props.color};
`;

const Heading = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  padding-top: 12px;
  margin-bottom: ${grid}px;
  text-align: left;
`;

const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  margin-bottom: ${grid4x}px;
  text-align: left;
`;

const ContentContainer = styled.View`
  padding: ${grid3x}px;
  padding-bottom: 0;
  flex: 1;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.white};
`;

const MinHeight = styled.View<{ minHeight?: number }>`
  min-height: ${(props) => props.minHeight ?? 0}px;
`;

export const ButtonContainer = styled.View<{
  bottomPadding?: number;
  padding?: number;
}>`
  padding: ${(props) => props.padding ?? grid3x}px;
  padding-bottom: ${(props) =>
    props.bottomPadding ?? props.padding ?? grid3x}px;
  background-color: ${colors.white};
`;

export interface FormV2Props extends FormHeaderProps {
  children?: React.ReactNode;
  heading?: string;
  headingStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  buttonText?: string;
  buttonTestID?: string;
  buttonLoading?: boolean;
  onButtonPress?(): void;
  buttonAccessibilityHint?: string;
  buttonAccessibilityLabel?: string;
  secondaryButtonText?: string;
  onSecondaryButtonPress?(): void;
  renderButton?(): React.ReactNode;
  renderFooter?(): React.ReactNode;
  accessibilitySecondaryHint?: string;
  accessibilitySecondaryLabel?: string;
  removePaddingWhenKeyboardShown?: boolean;
  /**
   * If true, form will respond to keyboard events. Should be true for forms with text inputs
   */
  keyboardAvoiding?: boolean;
  bannerText?: string;
  bannerColor?: string;
  bannerTextColor?: string;
  bannerIcon?: ImageSourcePropType;
  bannerAccessibilityLabel?: string;
}

export interface FormV2Handle {
  scrollToEnd(): void;
  scrollTo(options: { x?: number; y?: number; animated?: boolean }): void;
  showToast(message: string): void;
  hideToast(): void;
  accessibilityFocusOnBanner(): void;
}

export interface FormV2ContextValue {
  scrollTo(options: { x?: number; y?: number; animated?: boolean }): void;
  getHeight(): number;
  getHeaderHeight(): number;
  onInputFocus(index: number): void;
}

const noop = () => {};

export const FormV2Context = createContext<FormV2ContextValue>({
  scrollTo: noop,
  getHeight: () => 0,
  getHeaderHeight: () => 0,
  onInputFocus: noop,
});

function _FormV2(props: FormV2Props, ref: Ref<FormV2Handle>) {
  const {
    children,
    heading,
    headingStyle,
    description,
    descriptionStyle,
    buttonText,
    buttonTestID,
    buttonLoading,
    onButtonPress,
    buttonAccessibilityLabel,
    buttonAccessibilityHint,
    renderButton,
    renderFooter,
    secondaryButtonText,
    onSecondaryButtonPress,
    accessibilitySecondaryHint,
    accessibilitySecondaryLabel,
    keyboardAvoiding,
    removePaddingWhenKeyboardShown,
  } = props;

  const {
    headerBanner,
    headerImage,
    headerBackgroundColor,
  }: FormHeaderProps = props;

  const { height: viewHeight } = Dimensions.get("window");

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollViewHeight = useRef(0);
  const headerHeight = useRef(0);

  const scrollTo = useCallback(
    (options: { x?: number; y?: number; animated?: boolean }) => {
      scrollViewRef.current?.scrollTo(options);
    },
    [],
  );

  const getHeight = useCallback(() => {
    return scrollViewHeight.current;
  }, []);

  const getHeaderHeight = useCallback(() => {
    return headerHeight.current;
  }, []);

  const onInputFocus = useCallback(() => {
    setKeyboardShown(true);
  }, []);

  const [toastError, setToastError] = useToast();

  const bannerRef = useRef<View | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToEnd() {
      scrollViewRef.current?.scrollToEnd();
    },
    scrollTo,
    getHeight,
    showToast: (message) => {
      setToastError(message);
    },
    hideToast() {
      setToastError(undefined);
    },
    accessibilityFocusOnBanner() {
      const handle = findNodeHandle(bannerRef.current);
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
        setTimeout(() => {
          // Doesn't work the first time for some reason
          // Also see useAccessibleTitle.tsx
          // TODO: Remove when this issue is fixed: https://github.com/facebook/react-native/issues/30097
          AccessibilityInfo.setAccessibilityFocus(handle);
        }, 250);
      }
    },
  }));

  const button = useMemo(() => {
    if (renderButton != null) {
      return renderButton();
    }
    if (buttonText != null) {
      return (
        <Button
          testID={buttonTestID}
          text={buttonText}
          onPress={onButtonPress}
          isLoading={buttonLoading}
          accessibilityLabel={buttonAccessibilityLabel}
          accessibilityHint={buttonAccessibilityHint}
        />
      );
    }
    return null;
  }, [
    buttonText,
    onButtonPress,
    renderButton,
    buttonLoading,
    buttonTestID,
    buttonAccessibilityLabel,
    buttonAccessibilityHint,
  ]);

  const [keyboardShown, setKeyboardShown] = useState(false);

  const handleKeyboardWillShow = useCallback(() => {
    setKeyboardShown(true);
  }, []);

  const handleKeyboardWillHide = useCallback(() => {
    setKeyboardShown(false);
  }, []);

  const handleKeyboardDidShow = useCallback(() => {
    setKeyboardShown(true);
  }, []);

  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardShown(false);
  }, []);

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow);
    Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide);
    // Need these as Android doesn't have will show / hide event
    Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
    Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardWillShow", handleKeyboardWillShow);
      Keyboard.removeListener("keyboardWillHide", handleKeyboardWillHide);
      Keyboard.removeListener("keyboardDidShow", handleKeyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", handleKeyboardDidHide);
    };
  }, [
    handleKeyboardWillShow,
    handleKeyboardWillHide,
    handleKeyboardDidShow,
    handleKeyboardDidHide,
  ]);

  const secondaryButton = useMemo(() => {
    if (secondaryButtonText == null) {
      return undefined;
    }
    return (
      <SecondaryButton
        text={secondaryButtonText}
        onPress={buttonLoading ? undefined : onSecondaryButtonPress}
        accessible={true}
        accessibilityLabel={accessibilitySecondaryLabel || secondaryButtonText}
        accessibilityHint={accessibilitySecondaryHint}
      />
    );
  }, [
    secondaryButtonText,
    onSecondaryButtonPress,
    buttonLoading,
    accessibilitySecondaryHint,
    accessibilitySecondaryLabel,
  ]);

  const buttons = useMemo(
    () => (
      <>
        {button}
        {secondaryButton}
      </>
    ),
    [button, secondaryButton],
  );

  const navHeaderHeight = useHeaderHeight();

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    scrollViewHeight.current = event.nativeEvent.layout.height;
    setMinHeight(scrollViewHeight.current);
  }, []);

  const handleHeightChanged = useCallback((value: number) => {
    headerHeight.current = value;
  }, []);

  const [minHeight, setMinHeight] = useState(
    viewHeight -
      // no idea where the 8 comes from
      8,
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === "ios" && (keyboardAvoiding ?? false)}
      keyboardVerticalOffset={navHeaderHeight}
    >
      {!!toastError && <Toast text={toastError} />}
      <Container
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
        onLayout={handleLayout}
        keyboardDismissMode="on-drag"
      >
        <MinHeight minHeight={minHeight}>
          <FormHeader
            headerBanner={headerBanner}
            headerImage={headerImage}
            headerBackgroundColor={headerBackgroundColor}
            onHeightChanged={handleHeightChanged}
          />
          {
            // TODO: This might break height calculation
            props.bannerIcon ? (
              <Banner
                ref={bannerRef}
                color={props.bannerColor}
                accessibilityLabel={props.bannerAccessibilityLabel}
                accessibilityLiveRegion="polite"
                accessible={true}
              >
                <Image source={props.bannerIcon} />
                <BannerText color={props.bannerTextColor}>
                  {props.bannerText}
                </BannerText>
              </Banner>
            ) : null
          }
          <ContentContainer>
            {!!heading && <Heading style={headingStyle}>{heading}</Heading>}
            {!!description && (
              <Description style={descriptionStyle}>{description}</Description>
            )}
            <FormV2Context.Provider
              value={{ scrollTo, getHeight, getHeaderHeight, onInputFocus }}
            >
              {children}
            </FormV2Context.Provider>
          </ContentContainer>
          <ButtonContainer
            padding={
              keyboardAvoiding &&
              keyboardShown &&
              removePaddingWhenKeyboardShown
                ? 0
                : undefined
            }
            bottomPadding={renderFooter || !!secondaryButton ? 0 : undefined}
          >
            <>{buttons}</>
          </ButtonContainer>
          {renderFooter?.()}
        </MinHeight>
      </Container>
    </KeyboardAvoidingView>
  );
}

export const FormV2 = forwardRef(_FormV2);
