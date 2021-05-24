import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";

export function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <TouchableWithoutFeedback
      {...props}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityHint={props.accessibilityHint}
    >
      <View style={props.style}>{props.children}</View>
    </TouchableWithoutFeedback>
  );
}
