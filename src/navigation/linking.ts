import { DiaryScreen } from "@features/diary/screens";
import { LinkingOptions } from "@react-navigation/native";
import { MainStackScreen } from "@views/screens";

export const linking: LinkingOptions = {
  prefixes: ["nzcovidtracer://"],
  config: {
    screens: {
      [MainStackScreen.Navigator]: {
        screens: {
          [DiaryScreen.Diary]: "diary",
          [DiaryScreen.AddEntryManually]: "manualEntry",
        },
      },
    },
  },
};
