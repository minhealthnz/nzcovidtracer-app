import React from "react";
import { Image, ImageSourcePropType } from "react-native";

export function TabBarIcon({
  source,
}: {
  source: ImageSourcePropType;
  routeName: string;
}) {
  return <Image accessible={false} source={source} />;
}
