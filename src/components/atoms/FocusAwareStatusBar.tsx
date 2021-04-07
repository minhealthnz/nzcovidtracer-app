import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { ColorValue, StatusBar, StatusBarStyle } from "react-native";

interface Props {
  barStyle?: StatusBarStyle;
  backgroundColor: ColorValue;
}

export function FocusAwareStatusBar(props: Props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}
