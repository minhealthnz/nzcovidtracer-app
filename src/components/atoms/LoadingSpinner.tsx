import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const spinner = require("@assets/icons/loader.png");

export function LoadingSpinner() {
  const rotation = useRef(new Animated.Value(0));

  const rotateData = rotation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation.current, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);

  return (
    <Animated.Image
      style={{ transform: [{ rotateZ: rotateData }] }}
      source={spinner}
    />
  );
}
