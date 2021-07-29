import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { ColorValue, StatusBar, StatusBarStyle } from "react-native";

import Divider from "./Divider";

interface Props {
  barStyle?: StatusBarStyle;
  backgroundColor: ColorValue;
  divider?: boolean;
}

export function FocusAwareStatusBar(props: Props) {
  const isFocused = useIsFocused();

  return isFocused ? (
    <>
      <StatusBar {...props} />
      {props.divider && <Divider />}
    </>
  ) : null;
}
