import { colors, grid2x } from "@constants";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${colors.white};
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: 80px;
`;

const PlaceholderView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const PlaceholderTextView = styled.View`
  flex-direction: column;
  flex: 1;
  min-height: 80px;
  padding-horizontal: ${grid2x}px;
  justify-content: center;
`;

const IconPlaceholder = styled.View`
  background-color: ${colors.lightGrey};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-left: ${grid2x}px;
`;

const PlaceholderText = styled.View`
  background-color: ${colors.lightGrey};
  width: 100%;
  height: 10px;
  margin-vertical: 3px;
`;

export const StatsLoading = () => {
  const opacity = useRef(new Animated.Value(0.75));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.sin,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.75,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.sin,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacity.current }}>
      <Container>
        <PlaceholderView>
          <IconPlaceholder />
          <PlaceholderTextView>
            <PlaceholderText />
            <PlaceholderText />
          </PlaceholderTextView>
        </PlaceholderView>
      </Container>
    </Animated.View>
  );
};
