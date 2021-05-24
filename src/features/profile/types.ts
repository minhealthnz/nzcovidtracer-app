import { ImageSourcePropType } from "react-native";

export interface ProfileCard {
  headerImage: ImageSourcePropType | string;
  title: string;
  description?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  isLink?: boolean;
  testID?: string;
}

export type ProfileItem = ProfileCard | "footer";
