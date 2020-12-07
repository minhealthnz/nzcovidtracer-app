import React from "react";
import { Platform } from "react-native";

import { DatePickerAndroid } from "./DatePickerAndroid";
import { DatePickerIOS } from "./DatePickerIOS";

export type DatePickerMode = "time" | "date" | "datetime" | "countdown";

export interface DatePickerProps {
  onDateChange: (dateTime: number) => void;
  dateTime: number;
  errorMessage?: string;
  justDate?: boolean;
  clearErrorMessage?: () => void;
  label: string;
  maximumDate?: Date;
  minimumDate?: Date;
  minuteInterval?: 5;
}

export function DatePicker(props: DatePickerProps) {
  if (Platform.OS === "ios") {
    return <DatePickerIOS {...props} />;
  }

  return <DatePickerAndroid {...props} />;
}
