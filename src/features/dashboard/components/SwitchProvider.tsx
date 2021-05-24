import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import React from "react";
import { Animated } from "react-native";

interface Props {
  children: ReactNode;
}

export function SwitchProvider({ children }: Props) {
  const [index, setIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const scrollToPageRef = useRef<((index: number) => void) | undefined>();

  const registerScrollToPage = useCallback(
    (callback: (_index: number) => void) => {
      scrollToPageRef.current = callback;
    },
    [],
  );

  const scrollToPage = useCallback((i: number) => {
    scrollToPageRef.current?.(i);
  }, []);

  useEffect(() => {
    scrollToPage(index);
  }, [scrollToPage, index]);

  return (
    <SwitchContext.Provider
      value={{
        scrollX: scrollX,
        registerScrollToPage,
        scrollToPage,
        index,
        setIndex,
        scrollIndex,
        setScrollIndex,
      }}
    >
      {children}
    </SwitchContext.Provider>
  );
}

export const SwitchContext = createContext({
  scrollX: new Animated.Value(0),
  registerScrollToPage(_scrollToPage: (index: number) => void) {},
  scrollToPage(_index: number) {},
  index: 0,
  setIndex: (_index: number) => {},
  scrollIndex: 0,
  setScrollIndex: (_index: number) => {},
});
