import { ImageSourcePropType } from "react-native";

export interface StatItem {
  value: string;
  dailyChange?: number | string;
  dailyChangeIsGood?: boolean;
  icon: string;
  subtitle: string;
  backgroundColor?: string;
  url?: string;
}

export interface Statistics {
  title: string;
  dashboardItems: StatItem[][];
  sourceUrl: string;
  sourceDisplay: string;
}

export interface DashboardCard {
  headerImage: ImageSourcePropType | string;
  title: string;
  description: string;
  onPress?: () => void;
  isFooter?: false;
  isImportant?: boolean;
  isGrouped?: boolean;
  accessibilityHint?: string;
  isStatistic?: boolean;
  backgroundColor?: string;
  isError?: boolean;
  isLink?: boolean;
  isConnected?: boolean;
}

export interface ReminderCard {
  title: string;
  body: string;
}

export type DashboardItem =
  | DashboardCard
  | "footer"
  | "beenInCloseContact"
  | "beenInContact"
  | "statsLoading"
  | "announcement"
  | "bluetoothStatus"
  | "vaccinePassInfo"
  | "reminder"
  | undefined
  | false;
