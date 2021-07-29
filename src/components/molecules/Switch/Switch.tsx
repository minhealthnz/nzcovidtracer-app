import { NotAccessible } from "@components/atoms/NotAccessible";
import { SwitchContext } from "@features/dashboard/components/SwitchProvider";
import { selectIsScreenReaderEnabled } from "@features/device/selectors";
import React, {
  forwardRef,
  LegacyRef,
  Ref,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { itemWidth, maskMargin } from "./constants";
import { Mask } from "./Mask";
import { SwitchLayer } from "./SwitchLayer";

interface SwitchProps {
  titles: string[];
  accessibilityLabel: string;
  accessibilityHint?: string;
}

const Overlay = styled.View`
  position: absolute;
`;

function _Switch(
  { titles, accessibilityLabel, accessibilityHint }: SwitchProps,
  ref: Ref<React.Component<any, any>>,
) {
  const { scrollX, index, setIndex } = useContext(SwitchContext);

  const { width: windowWidth } = useWindowDimensions();

  const left = useRef(
    Animated.add(
      Animated.multiply(scrollX, (1 / windowWidth) * itemWidth),
      maskMargin,
    ),
  ).current;

  const handleIndexChange = useCallback(
    (v: number) => {
      setIndex(v);
    },
    [setIndex],
  );

  const handleFling = useCallback(
    (direction: "left" | "right") => {
      const delta = direction === "left" ? -1 : 1;
      handleIndexChange(
        Math.max(Math.min(index + delta, titles.length - 1), 0),
      );
    },
    [index, handleIndexChange, titles.length],
  );

  const isScreenReaderEnabled = useSelector(selectIsScreenReaderEnabled);

  const nextIndex = index === 0 ? 1 : 0;

  const handlePress = useCallback(() => {
    setIndex(nextIndex);
  }, [nextIndex, setIndex]);

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={"button"}
      onPress={isScreenReaderEnabled ? handlePress : undefined}
      ref={ref as LegacyRef<TouchableOpacity>}
    >
      <NotAccessible>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              handleFling("left");
            }
          }}
        >
          <FlingGestureHandler
            direction={Directions.RIGHT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                handleFling("right");
              }
            }}
          >
            <View pointerEvents={isScreenReaderEnabled ? "none" : undefined}>
              <SwitchLayer titles={titles} onPress={handleIndexChange} />
              <Overlay pointerEvents="none">
                <Mask left={left}>
                  <SwitchLayer titles={titles} isOverlay={true} />
                </Mask>
              </Overlay>
            </View>
          </FlingGestureHandler>
        </FlingGestureHandler>
      </NotAccessible>
    </TouchableOpacity>
  );
}

export const Switch = forwardRef(_Switch);
