import React from "react";
import { Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  cover: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.cover}
      />
    </View>
  );
}
