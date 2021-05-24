import { selectIsScreenReaderEnabled } from "@features/device/selectors";
import { createLogger } from "@logger/createLogger";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { AccessibleHeaderTitle } from "./AccessibleHeaderTitle";
import { useFocusView } from "./useFocusView";

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
  const { focusView, ref: titleRef } = useFocusView();

  const enabled = useSelector(selectIsScreenReaderEnabled);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    navigation.setOptions({
      headerTitle: (props) => {
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
  }, [navigation, enabled, title, hint, titleRef]);

  // Focus on title when screen is brought to foreground (focused)
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (!isFocused) {
      logInfo("not focused");
      return;
    }

    return focusView();
  }, [isFocused, focusView, enabled]);

  return { focusTitle: focusView };
}
