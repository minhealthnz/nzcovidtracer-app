import { createLogger } from "@logger/createLogger";
import { Component, Ref, useCallback, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

const { logInfo } = createLogger("useFocusView");

export function useFocusView() {
  const ref = useRef<Component<any, any>>();

  const focusViewOnce = useCallback(() => {
    if (ref.current == null) {
      logInfo("no title");
      return;
    }
    const handle = findNodeHandle(ref.current);
    if (handle == null) {
      logInfo("no handle");
      return;
    }
    AccessibilityInfo.setAccessibilityFocus(handle);
    logInfo("auto focused");
  }, [ref]);

  const focusView = useCallback(() => {
    let count = 0;
    // Need a timeout to wait for the header title to render
    const id = setInterval(() => {
      // Retry twice as there are some timing issues on iOS,
      // and Android first focus from launch always failing
      if (count >= 2) {
        clearInterval(id);
        return;
      }

      focusViewOnce();
      count++;
    }, 250);

    return () => clearInterval(id);
  }, [focusViewOnce]);

  return { focusView, ref: ref as Ref<Component<any, any>> };
}
