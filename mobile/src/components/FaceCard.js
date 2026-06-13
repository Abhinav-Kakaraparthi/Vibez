import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";

export default function FaceCard({ user, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={onPress}>
      <Image source={{ uri: user.profile_photo_url }} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    margin: "1.5%",
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: COLORS.lightGray,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 7,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});