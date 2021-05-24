import { grid2x } from "@constants";
import React from "react";
import {
  SectionList as BaseSectionList,
  SectionListProps,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { VerticalSpacing } from "./VerticalSpacing";

interface Props<T> extends SectionListProps<T> {
  style?: ViewStyle;
}

export function SectionList<T>(props: Props<T>) {
  return (
    <BaseSectionList
      contentContainerStyle={props.style || styles.container}
      scrollEnabled={true}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <VerticalSpacing />}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: grid2x,
    paddingHorizontal: grid2x,
  },
});
