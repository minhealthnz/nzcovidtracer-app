import { Banner, BannerText } from "@components/atoms/Banner";
import Divider from "@components/atoms/Divider";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid2x,
  grid3x,
  grid4x,
} from "@constants";
import { selectIsReduceMotionEnabled } from "@features/device/selectors";
import { useToast } from "@hooks/useToast";
import { useHeaderHeight } from "@react-navigation/stack";
import { isNil } from "lodash";
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
  Dimensions,
  findNodeHandle,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Keyboard,
  KeyboardEvent,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  TextStyle,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import Button from "../atoms/Button";
import { FormHeader } from "../atoms/FormHeader";
import { FormHeaderProps } from "../atoms/FormHeader";
import { SecondaryButton } from "../atoms/SecondaryButton";
import { Text } from "../atoms/Text";
import { Toast } from "../atoms/Toast";

const Container = styled.ScrollView<{ backgroundColor?: string }>`
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.white};
  flex: 1;
`;

export const Step = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryGray};
  font-size: ${fontSizes.small}px;
`;

export const Heading = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  padding-top: 12px;
  margin-bottom: ${grid2x}px;
  text-align: left;
`;

export const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  margin-bottom: ${grid4x}px;
  text-align: left;
`;

const ContentContainer = styled.View<{
  padding?: number;
  paddingBottom?: number;
  paddingTop?: number;
}>`
  padding: ${(props) => props.padding}px;
  padding-bottom: ${(props) =>
    props.paddingBottom ? props.paddingBottom : 0}px;
  padding-top: ${(props) =>
    !isNil(props.paddingTop) ? props.paddingTop : props.padding}px;
  flex: 1;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView<{
  backgroundColor?: string;
}>`
  flex: 1;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.white};
`;

const MinHeight = styled.View<{ minHeight?: number }>`
  min-height: ${(props) => props.minHeight ?? 0}px;
`;

export const ButtonContainer = styled.View<{
  bottomPadding?: number;
  padding?: number;
  backgroundColor?: string;
}>`
  padding: ${(props) => props.padding ?? grid2x}px;
  padding-bottom: ${(props) =>
    props.bottomPadding ?? props.padding ?? grid2x}px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.white};
`;

export interface FormV2Props extends FormHeaderProps {
  children?: React.ReactNode;
  heading?: string;
  step?: string;
  headerImageAccessibilityLabel?: string;
  headerImageStyle?: ImageStyle;
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
  backgroundColor?: string;
  padding?: number;
  paddingTop?: number;
  bannerText?: string;
  bannerColor?: string;
  bannerTextColor?: string;
  bannerIcon?: ImageSourcePropType;
  bannerAccessibilityLabel?: string;
  /**
   * If true, form will resize to avoid the keyboard.
   * Only applicable to iOS as Android already clips the app view port automatically.
   * This is to avoid unwanted transitions when navigating away from a view that has keyboard shown.
   * Should be true for forms with text inputs.
   */
  keyboardAvoiding?: boolean;
  /**
   * If true, snap buttons to the bottom of the form
   */
  snapButtonsToBottom?: boolean;
  /**
   * If true, when keyboard is shown, show buttons above the keyboard
   */
  showButtonsAboveKeyboard?: boolean;
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
    headerImageAccessibilityLabel,
    headerImageStyle,
    heading,
    step,
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

  const { headerBanner, headerImage, headerBackgroundColor }: FormHeaderProps =
    props;

  const { height: viewHeight } = Dimensions.get("window");

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollViewHeight = useRef(0);
  const headerHeight = useRef(0);
  const isReduceMotionEnabled = useSelector(selectIsReduceMotionEnabled);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const [toastMessage, setToastMessage] = useToast();

  const bannerRef = useRef<View | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToEnd() {
      scrollViewRef.current?.scrollToEnd();
    },
    scrollTo,
    getHeight,
    showToast: (message) => {
      setToastMessage(message);
    },
    hideToast() {
      setToastMessage(undefined);
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
  const handleKeyboardWillShow = useCallback((e: KeyboardEvent) => {
    setKeyboardShown(true);
    setKeyboardHeight(e.endCoordinates.height);
  }, []);
  const handleKeyboardWillHide = useCallback(() => {
    setKeyboardShown(false);
  }, []);
  const handleKeyboardDidShow = useCallback((e: KeyboardEvent) => {
    setKeyboardShown(true);
    setKeyboardHeight(e.endCoordinates.height);
  }, []);
  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardShown(false);
  }, []);
  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow),
      Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide),
      // Need these as Android doesn't have will show / hide event
      Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow),
      Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide),
    ];
    return () => {
      subscriptions.forEach((s) => s?.remove?.());
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

  const shouldSnapToBottom =
    props.snapButtonsToBottom &&
    (props.showButtonsAboveKeyboard || !keyboardShown);

  const buttonContainer = useMemo(
    () => (
      <>
        {shouldSnapToBottom && <Divider />}
        <ButtonContainer
          padding={
            keyboardAvoiding && keyboardShown && removePaddingWhenKeyboardShown
              ? 0
              : undefined
          }
          bottomPadding={renderFooter || !!secondaryButton ? 0 : undefined}
          backgroundColor={props.backgroundColor}
        >
          {buttons}
        </ButtonContainer>
      </>
    ),
    [
      keyboardAvoiding,
      keyboardShown,
      removePaddingWhenKeyboardShown,
      secondaryButton,
      renderFooter,
      props.backgroundColor,
      buttons,
      shouldSnapToBottom,
    ],
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={
        Platform.OS === "ios" &&
        !isReduceMotionEnabled &&
        (keyboardAvoiding ?? false)
      }
      keyboardVerticalOffset={navHeaderHeight}
      backgroundColor={props.backgroundColor}
    >
      {!!toastMessage && <Toast text={toastMessage} />}
      <Container
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
        onLayout={handleLayout}
        keyboardDismissMode="on-drag"
        backgroundColor={props.backgroundColor}
      >
        <MinHeight minHeight={minHeight}>
          <FormHeader
            headerImageStyle={headerImageStyle}
            headerBanner={headerBanner}
            headerImage={headerImage}
            headerBackgroundColor={headerBackgroundColor}
            onHeightChanged={handleHeightChanged}
            accessibilityLabel={headerImageAccessibilityLabel}
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
          <ContentContainer
            padding={!isNil(props.padding) ? props.padding : grid3x}
            paddingBottom={isReduceMotionEnabled ? keyboardHeight : undefined}
            paddingTop={props.paddingTop}
          >
            {!!step && <Step>{step}</Step>}
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
          {!shouldSnapToBottom && buttonContainer}
          {renderFooter?.()}
        </MinHeight>
      </Container>
      {shouldSnapToBottom && buttonContainer}
    </KeyboardAvoidingView>
  );
}

export const FormV2 = forwardRef(_FormV2);
