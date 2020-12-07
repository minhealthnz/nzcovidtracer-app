import { colors } from "@constants";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function DummyStatusBar() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: insets.top, backgroundColor: colors.yellow }} />
  );
}
