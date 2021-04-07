import { colors, fontFamilies, fontSizes } from "@constants";
import { StackNavigationOptions } from "@react-navigation/stack";

export const headerOptions: StackNavigationOptions = {
  headerTitleAlign: "center",
  headerTitleAllowFontScaling: false,
  headerBackAllowFontScaling: false,
  headerBackTitle: "",
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: colors.yellow,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontFamily: fontFamilies["baloo-semi-bold"],
    fontSize: fontSizes.normal,
  },
};
