import { HeaderTitle } from "@react-navigation/stack";
import React, { forwardRef, Ref } from "react";
import { Animated, StyleProp, TextProps, TextStyle, View } from "react-native";

type HeaderTitleProps = Omit<TextProps, "style"> & {
  tintColor?: string;
  children?: string;
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  viewRef?: any;
  accessibilityHint?: string;
};

function _AccessibleHeaderTitle(props: HeaderTitleProps, ref: Ref<any>) {
  return (
    <View
      ref={ref}
      accessible={true}
      accessibilityLabel={props.children}
      accessibilityHint={props.accessibilityHint}
      accessibilityRole="header"
      aria-level="1"
    >
      <HeaderTitle {...props}>{props.children}</HeaderTitle>
    </View>
  );
}

export const AccessibleHeaderTitle = forwardRef(_AccessibleHeaderTitle);
