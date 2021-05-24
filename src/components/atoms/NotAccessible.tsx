import React, { ReactNode } from "react";
import { View } from "react-native";

interface Props {
  children: ReactNode;
}

export function NotAccessible({ children }: Props) {
  return (
    <View
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </View>
  );
}
