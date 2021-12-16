import { fontFamilies } from "@constants";
import { selectAppState } from "@features/device/selectors";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const AnimationDuration = 10000;
const NumberOfEmojis = 40;
const EmojiSize = 100;

const FullscreenView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Emoji = styled(Animated.Text)`
  font-size: ${EmojiSize}px;
  font-family: ${fontFamilies.baloo};
  position: absolute;
  bottom: 0;
  left: 0;
`;

const fallbackEmojis = ["💛"];

export interface EasterEggOverlayProps {
  visible: boolean;
  onFinish: () => void;
  emojis: string[];
}

export function EasterEggOverlay(props: EasterEggOverlayProps) {
  const { width, height } = useWindowDimensions();
  const wasVisible = useRef(false);
  const { visible, onFinish, emojis } = props;
  const appState = useSelector(selectAppState);

  const emojiAnimations = useMemo(() => {
    const animations: Animated.Value[] = [];
    for (let i = 0; i < NumberOfEmojis; i++) {
      animations.push(new Animated.Value(0));
    }
    return animations;
  }, []);

  const emojiOffsets = useMemo<number[]>(() => {
    const offsets: number[] = [];
    for (let i = 0; i < NumberOfEmojis; i++) {
      offsets.push(Math.random() * (width - EmojiSize));
    }
    return offsets;
  }, [width]);

  const renderEmojis = useCallback(
    (emojiList: string[]) => {
      return emojiAnimations.map((animation, index) => {
        const yMin = EmojiSize;
        const yMax = -height / 2;
        return (
          <Emoji
            allowFontScaling={false}
            key={index}
            style={{
              opacity: animation.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [yMin, yMax],
                  }),
                },
                {
                  translateX: emojiOffsets[index],
                },
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 1],
                  }),
                },
              ],
            }}
          >
            {emojiList[Math.floor(Math.random() * emojiList.length)]}
          </Emoji>
        );
      });
    },
    [emojiAnimations, emojiOffsets, height],
  );

  const startAnimation = useCallback(() => {
    Animated.parallel(
      emojiAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          useNativeDriver: true,
          duration: AnimationDuration / 5,
          easing: Easing.linear,
          delay: Math.random() * 8000,
        }),
      ),
    ).start(() => {
      wasVisible.current = false;
      onFinish();
    });
  }, [emojiAnimations, wasVisible, onFinish]);

  useEffect(() => {
    if (visible && !wasVisible.current) {
      startAnimation();
      wasVisible.current = true;
    }
    if (!visible) {
      wasVisible.current = false;
    }
    return undefined;
  }, [visible, startAnimation]);
  if (appState !== "active") {
    return null;
  }
  return (
    <FullscreenView pointerEvents="none">
      {renderEmojis(emojis.length > 0 ? emojis : fallbackEmojis)}
    </FullscreenView>
  );
}
