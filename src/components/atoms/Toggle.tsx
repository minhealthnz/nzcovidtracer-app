import { colors } from "@constants";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const THUMB_OFFSET_ON = 14;
const THUMB_OFFSET_OFF = 0;
const ANIMATION_DURATION = 200;
const THUMB_ANIMATION_EASING = Easing.inOut(Easing.quad);
const TRACK_ANIMATION_EASING = Easing.linear;

interface Props {
  value: boolean;
  isLoading?: boolean;
}

export function Toggle(props: Props) {
  const thumbOffset = useRef(
    new Animated.Value(props.value ? THUMB_OFFSET_ON : THUMB_OFFSET_OFF),
  );
  const trackColor = useRef(new Animated.Value(props.value ? 1 : 0));
  const thumbColor = useRef(new Animated.Value(props.value ? 1 : 0));
  const thumbBorder = useRef(new Animated.Value(props.isLoading ? 1 : 0));

  const prevValue = useRef(props.value);

  // If it's loading, slow a spinning border around the thumb
  useEffect(() => {
    Animated.loop(
      Animated.timing(thumbBorder.current, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: TRACK_ANIMATION_EASING,
      }),
    ).start();
  }, [props.isLoading]);

  useEffect(() => {
    if (props.value === prevValue.current) {
      return;
    }
    prevValue.current = props.value;
    thumbOffset.current.stopAnimation();
    if (!props.value) {
      thumbOffset.current.setValue(THUMB_OFFSET_ON);
      trackColor.current.setValue(1);
      thumbColor.current.setValue(1);
      Animated.parallel([
        Animated.timing(thumbOffset.current, {
          toValue: THUMB_OFFSET_OFF,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: THUMB_ANIMATION_EASING,
        }),
        Animated.timing(trackColor.current, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: TRACK_ANIMATION_EASING,
        }),
        Animated.timing(thumbColor.current, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: TRACK_ANIMATION_EASING,
        }),
      ]).start();
    } else {
      thumbOffset.current.setValue(THUMB_OFFSET_OFF);
      trackColor.current.setValue(0);
      thumbColor.current.setValue(0);
      Animated.parallel([
        Animated.timing(thumbOffset.current, {
          toValue: THUMB_OFFSET_ON,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: THUMB_ANIMATION_EASING,
        }),
        Animated.timing(trackColor.current, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: TRACK_ANIMATION_EASING,
        }),
        Animated.timing(thumbColor.current, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
          easing: TRACK_ANIMATION_EASING,
        }),
      ]).start();
    }
  }, [props.value, prevValue]);

  return (
    <View style={styles.touchable}>
      <Animated.View
        style={{
          ...styles.track,
          backgroundColor: trackColor.current.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.fadedGrey, colors.fadedGreen],
          }),
        }}
      >
        <Animated.View
          style={{
            ...styles.thumb,
            backgroundColor: thumbColor.current.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.darkGrey, colors.green],
            }),
            transform: [{ translateX: thumbOffset.current }],
          }}
        >
          {props.isLoading && (
            <Animated.View
              style={{
                ...styles.thumbBorder,
                transform: [
                  {
                    rotate: thumbBorder.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            />
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbBorder: {
    height: 17,
    width: 17,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderLeftColor: colors.white,
    borderRightColor: colors.white,
    borderBottomColor: colors.white,
    borderTopColor: "transparent",
    borderWidth: 3,
    padding: 5,
  },
  track: {
    width: 34,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    paddingVertical: 4,
  },
  touchable: {
    overflow: "visible",
    height: 24,
    justifyContent: "center",
  },
});
