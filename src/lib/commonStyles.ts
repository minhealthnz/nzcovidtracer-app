import { grid2x } from "@constants";
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  headingBig: {
    paddingTop: 8,
    fontSize: 32,
    lineHeight: 36,
  },
  headerImage: {
    width: 375,
    height: 165,
    marginTop: 10,
    marginBottom: 0,
  },
  paddingBottom_grid2x: {
    paddingBottom: grid2x,
  },
});
