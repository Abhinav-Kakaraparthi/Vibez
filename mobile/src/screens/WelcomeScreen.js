import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import BackgroundGlow from "../components/BackgroundGlow";
import { COLORS } from "../constants/theme";

export default function WelcomeScreen({ onStart }) {
  return (
    <SafeAreaView style={styles.screen}>
      <BackgroundGlow />

      <View style={styles.center}>
        <Text style={styles.logo}>VibeZ</Text>
        <Text style={styles.title}>Connect with someone you just saw nearby</Text>
        <Text style={styles.text}>
          See only profile pictures. Send one respectful request. Details unlock only after consent.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { fontSize: 58, fontWeight: "900", color: COLORS.black },
  title: {
    marginTop: 22,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    color: COLORS.black,
  },
  text: {
    marginTop: 14,
    textAlign: "center",
    lineHeight: 24,
    color: COLORS.gray,
    fontSize: 15,
  },
  button: {
    width: "100%",
    marginTop: 32,
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "900" },
});