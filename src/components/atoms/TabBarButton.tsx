import { colors } from "@constants";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { TouchableNativeFeedback, View } from "react-native";

export function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <TouchableNativeFeedback
      {...props}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityHint={props.accessibilityHint}
      background={TouchableNativeFeedback.Ripple(colors.platinum, true)}
    >
      <View style={props.style}>{props.children}</View>
    </TouchableNativeFeedback>
  );
}
