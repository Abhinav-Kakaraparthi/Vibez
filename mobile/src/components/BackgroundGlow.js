import React from "react";
import { View, StyleSheet } from "react-native";

export default function BackgroundGlow() {
  return (
    <>
      <View style={styles.glowBlue} />
      <View style={styles.glowPurple} />
    </>
  );
}

const styles = StyleSheet.create({
  glowBlue: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(74,144,226,0.18)",
    top: 90,
    right: -120,
  },
  glowPurple: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(108,92,231,0.16)",
    bottom: 80,
    left: -120,
  },
});