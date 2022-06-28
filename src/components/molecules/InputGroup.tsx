import { selectIsReduceMotionEnabled } from "@features/device/selectors";
import { createLogger } from "@logger/createLogger";
import _ from "lodash";
import React, {
  createContext,
  forwardRef,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import { FormV2Context } from "./FormV2";

export interface InputGroupProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  onFocus?(index: number): void;
  style?: ViewStyle;
}

export interface InputGroupContextValue {
  index: number;
  isLast: boolean;
  focusNext(index: number): void;
  register(
    index: number,
    identifier: string | undefined,
    focus: () => boolean,
    accessibilityFocus?: () => void,
  ): void;
  deregister(index: number): void;
  onFocus(index: number): void;
}

const noop = () => {};

export const InputGroupContext = createContext<InputGroupContextValue>({
  index: 0,
  isLast: false,
  focusNext: noop,
  register: noop,
  deregister: noop,
  onFocus: noop,
});

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

const { logInfo, logWarning } = createLogger("InputGroup");

export interface InputGroupRef {
  /**
   * Focus an input
   */
  focus(identifier: string): void;
  /**
   * Set accessibility focus on an input label
   */
  accessibilityFocus(identifier: string): void;
  /**
   * Scroll to an input
   */
  scrollTo(identifier: string): void;
  /**
   * Focus on error(s). Scroll to the top field that has an error.
   * When voice over is enabled, set accessibility focus on the input label as well
   * @param fields list of field identifiers that has errors
   */
  focusError(...fields: string[]): void;
}

function _InputGroup(props: InputGroupProps, ref: Ref<InputGroupRef>) {
  const focusFunctions = useRef<(() => boolean)[]>([]);
  const isInput = useRef<(boolean | undefined)[]>([]);
  const layouts = useRef<(Layout | undefined)[]>([]);
  const accessibilityFocusFunctions = useRef<(() => void)[]>([]);
  const isReduceMotionOn = useSelector(selectIsReduceMotionEnabled);

  useImperativeHandle(ref, () => ({
    focus(identifier: string) {
      const index = identifiers.current.indexOf(identifier);
      if (index === -1) {
        return;
      }
      focusFunctions.current[index]?.();
    },
    accessibilityFocus,
    scrollTo,
    focusError(...fields: string[]) {
      const set = new Set(fields);
      const index = identifiers.current.findIndex(
        (x) => x != null && set.has(x),
      );
      if (index === -1) {
        logWarning("index not found");
        return;
      }
      const identifier = identifiers.current[index];
      if (identifier == null) {
        logWarning("identifier is empty");
        return;
      }
      logInfo(`show error ${identifier}`);
      scrollTo(identifier);
      let count = 0;
      const id = setInterval(() => {
        if (count >= 2) {
          clearInterval(id);
        }
        accessibilityFocus(identifier);
        count++;
      }, 250);
    },
  }));

  const formV2 = useContext(FormV2Context);

  const accessibilityFocus = useCallback((identifier: string) => {
    const index = identifiers.current.indexOf(identifier);
    if (index === -1) {
      return;
    }
    logInfo(`accessibility focus to ${index} ${identifier}`);
    accessibilityFocusFunctions.current[index]?.();
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const layout = layouts.current[index];
      if (layout == null) {
        return;
      }
      logInfo(`scroll to ${index} ${layout.y}`);
      const height = formV2.getHeight();
      const headerHeight = formV2.getHeaderHeight();
      !isReduceMotionOn &&
        formV2.scrollTo({
          y: layout.y - height + layout.height + headerHeight,
          animated: Platform.OS === "ios",
        });
    },
    [formV2, isReduceMotionOn],
  );

  const scrollTo = useCallback(
    (identifier: string) => {
      const index = identifiers.current.indexOf(identifier);
      if (index === -1) {
        return;
      }
      scrollToIndex(index);
      logInfo(`scroll to ${index} ${identifier}`);
    },
    [scrollToIndex],
  );

  const lastInputIndex = (() => {
    for (let i = isInput.current.length - 1; i >= 0; i--) {
      if (isInput.current[i]) {
        return i;
      }
    }
    return -1;
  })();

  const focusIndex = useRef(-1);

  const onFocus = props.onFocus;
  const handleFocus = useCallback(
    (index: number) => {
      onFocus?.(index);
      focusIndex.current = index;
      if (Platform.OS === "android" || keyboardDidShow.current) {
        scrollToIndex(index);
      }
      formV2.onInputFocus(index);
    },
    [scrollToIndex, onFocus, formV2],
  );

  const keyboardDidShow = useRef(false);

  const handleKeyboardDidHide = useCallback(() => {
    keyboardDidShow.current = false;
  }, []);

  const handleKeyboardDidShow = useCallback(() => {
    keyboardDidShow.current = true;
    if (focusIndex.current !== -1) {
      scrollToIndex(focusIndex.current);
    }
  }, [scrollToIndex]);

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow),
      Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide),
    ];
    return () => {
      subscriptions.forEach((s) => s?.remove?.());
    };
  }, [handleKeyboardDidShow, handleKeyboardDidHide]);

  const onSubmit = props.onSubmit;
  const focusNext = useCallback(
    (index: number) => {
      for (let i = index + 1; i < focusFunctions.current.length; i++) {
        const result = focusFunctions.current[i]?.();

        if (result) {
          return;
        }
      }
      onSubmit?.();
    },
    [onSubmit],
  );

  const identifiers = useRef<(string | undefined)[]>([]);
  const register = useCallback(
    (
      index: number,
      identifier: string | undefined,
      focus: () => boolean,
      accessibilityFocusFucntion: () => void,
    ) => {
      isInput.current[index] = true;
      identifiers.current[index] = identifier;
      focusFunctions.current[index] = focus;
      accessibilityFocusFunctions.current[index] = accessibilityFocusFucntion;
    },
    [],
  );

  const deregister = useCallback((index: number) => {
    isInput.current[index] = false;
    identifiers.current[index] = undefined;
  }, []);

  const renderChildren = useMemo(() => {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    return children.map((child, index) => {
      const isLast = lastInputIndex === index;
      const value = {
        index,
        focusNext,
        register,
        deregister,
        isLast,
        onFocus: handleFocus,
      };
      return (
        <InputGroupContext.Provider
          key={`InputGroupChild${index}`}
          value={value}
        >
          <View
            style={props.style}
            onLayout={(event: LayoutChangeEvent) => {
              const layout = _.pick(
                event.nativeEvent.layout,
                "x",
                "y",
                "width",
                "height",
              );
              layouts.current[index] = layout;
            }}
          >
            {child}
          </View>
        </InputGroupContext.Provider>
      );
    });
  }, [
    focusNext,
    props.children,
    lastInputIndex,
    register,
    deregister,
    handleFocus,
    props.style,
  ]);

  return <>{renderChildren}</>;
}

export const InputGroup = forwardRef(_InputGroup);

interface InputGroupHandle {
  focusNext(): void;
  onFocus(): void;
  isLast: boolean;
}

export function useInputGroup(
  identifier: string | undefined,
  focus: () => boolean,
  accessibilityFocus?: () => void,
): InputGroupHandle {
  const { index, focusNext, register, deregister, isLast, onFocus } =
    useContext(InputGroupContext);

  useEffect(() => {
    register(index, identifier, focus, accessibilityFocus);
    return () => deregister(index);
  }, [index, register, deregister, identifier, focus, accessibilityFocus]);

  const _onFocus = useCallback(() => {
    onFocus(index);
  }, [index, onFocus]);

  return {
    focusNext: useCallback(() => focusNext(index), [focusNext, index]),
    onFocus: _onFocus,
    isLast,
  };
}
