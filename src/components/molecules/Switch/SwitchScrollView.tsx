import { SwitchContext } from "@features/dashboard/components/SwitchProvider";
import { createLogger } from "@logger/createLogger";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import React from "react";
import {
  Animated,
  NativeScrollEvent,
  ScrollView,
  useWindowDimensions,
} from "react-native";

export interface SwitchScrollViewProps {
  children: ReactNode;
}

const { logInfo } = createLogger("SwitchScrollView.tsx");

export function SwitchScrollView(props: SwitchScrollViewProps) {
  const { scrollX, setIndex, registerScrollToPage, setScrollIndex } =
    useContext(SwitchContext);

  const scrollViewRef = useRef<ScrollView>(null);
  const isDragging = useRef(false);

  const { width: windowWidth } = useWindowDimensions();

  const scrollToPage = useCallback(
    (page: number) => {
      if (scrollViewRef.current == null) {
        return;
      }
      if (isDragging.current) {
        return;
      }
      scrollViewRef.current.scrollTo({
        x: windowWidth * page,
        y: 0,
        animated: true,
      });
    },
    [windowWidth],
  );

  const handleBeginDrag = useCallback(() => {
    isDragging.current = true;
  }, []);

  useEffect(() => {
    registerScrollToPage(scrollToPage);
  }, [registerScrollToPage, scrollToPage]);

  const handleMomentumScrollEnd = useCallback(() => {
    isDragging.current = false;
    const nextIndex = Math.round(contentOffset.current.x / windowWidth);
    setIndex(nextIndex);
    setScrollIndex(nextIndex);

    logInfo(
      `scroll momentum stopped. x ${contentOffset.current.x} index ${nextIndex}`,
    );
  }, [setIndex, setScrollIndex, windowWidth]);

  const handleScroll = useCallback(
    ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
      contentOffset.current = nativeEvent.contentOffset;
    },
    [],
  );

  const contentOffset = useRef({
    x: 0,
    y: 0,
  });

  const onScroll = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ],
        {
          listener: handleScroll,
          useNativeDriver: false,
        },
      ),
    [scrollX, handleScroll],
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal={true}
      pagingEnabled={true}
      onScroll={onScroll}
      scrollEventThrottle={1000 / 60}
      onScrollBeginDrag={handleBeginDrag}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      showsHorizontalScrollIndicator={false}
      {...props}
    />
  );
}
