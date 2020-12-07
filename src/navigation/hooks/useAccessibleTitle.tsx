import { selectIsScreenReaderEnabled } from "@domain/device/selectors";
import { createLogger } from "@logger/createLogger";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, View } from "react-native";
import { useSelector } from "react-redux";

import { AccessibleHeaderTitle } from "./AccessibleHeaderTitle";

const { logInfo } = createLogger("useTitle");

interface AccessibleTitleOptions {
  title?: string;
  hint?: string;
}

export function useAccessibleTitle({
  title,
  hint,
}: AccessibleTitleOptions = {}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const titleRef = useRef<View | null>();

  const enabled = useSelector(selectIsScreenReaderEnabled);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    navigation.setOptions({
      headerTitle: (props) => (
        <AccessibleHeaderTitle
          ref={titleRef}
          {...props}
          children={title ?? props.children}
          accessibilityHint={hint}
        />
      ),
    });
  }, [navigation, enabled, title, hint]);

  const isFocused = useIsFocused();

  const focusTitle = useCallback(() => {
    if (!isFocused) {
      logInfo("not focused");
      return;
    }
    if (titleRef.current == null) {
      logInfo("no title");
      return;
    }
    const handle = findNodeHandle(titleRef.current);
    if (handle == null) {
      logInfo("no handle");
      return;
    }
    AccessibilityInfo.setAccessibilityFocus(handle);
    logInfo("auto focused");
  }, [titleRef, isFocused]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (!isFocused) {
      logInfo("not focused");
      return;
    }
    let count = 0;
    // Need a timeout to wait for the header title to render
    const id = setInterval(() => {
      // Retry twice as there are some timing issues on iOS,
      // and Android first focus from launch always failing
      if (count >= 2) {
        clearInterval(id);
        return;
      }

      focusTitle();
      count++;
    }, 250);
    return () => clearInterval(id);
  }, [isFocused, focusTitle, enabled]);

  return { focusTitle };
}
