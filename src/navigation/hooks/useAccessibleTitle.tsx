import { selectIsScreenReaderEnabled } from "@features/device/selectors";
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

/**
 * Make react-navigation header title accessible to screen readers.
 * Wrap the header string / element with AccessibleHeaderTitle
 * Auto focus on the header element on focus,
 * or when title text changes
 */
export function useAccessibleTitle({
  title,
  hint,
}: AccessibleTitleOptions = {}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const titleRef = useRef<View | null>();

  const enabled = useSelector(selectIsScreenReaderEnabled);

  const headerTextRef = useRef(title);

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

  const waitAndFocusTitle = useCallback(() => {
    setTimeout(() => {
      focusTitle();
    }, 0);
  }, [focusTitle]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    navigation.setOptions({
      headerTitle: (props) => {
        // Focus on title when text changes
        if (
          typeof props.children === "string" &&
          // Skip initial signal, only fire when title changes
          headerTextRef.current != null &&
          headerTextRef.current !== props.children
        ) {
          /**
           * Focus title on the next event loop,
           * to get rid of react warning that render functions needs to be pure
           */
          waitAndFocusTitle();
        }

        headerTextRef.current = props.children;

        return (
          <AccessibleHeaderTitle
            ref={titleRef}
            {...props}
            children={title ?? props.children}
            accessibilityHint={hint}
          />
        );
      },
    });
  }, [navigation, enabled, title, hint, waitAndFocusTitle]);

  // Focus on title when screen is brought to foreground (focused)
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
