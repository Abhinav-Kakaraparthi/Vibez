import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";

export default function RequestModal({
  selectedUser,
  profile,
  onSend,
  onClose,
}) {
  return (
    <Modal visible={!!selectedUser} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {selectedUser && (
            <Image
              source={{ uri: selectedUser.profile_photo_url }}
              style={styles.image}
            />
          )}

          <Text style={styles.title}>Send request?</Text>

          <Text style={styles.text}>
            They will see your profile first. You will not see their details
            unless they accept.
          </Text>

          {profile && (
            <View style={styles.senderPreview}>
              <Image source={{ uri: profile.photoUri }} style={styles.senderImage} />
              <View>
                <Text style={styles.senderName}>
                  {profile.firstName}, {profile.age}
                </Text>
                <Text style={styles.senderMeta}>{profile.gender}</Text>
              </View>
            </View>
          )}

          <View style={styles.ruleBox}>
            <Text style={styles.rule}>✓ Request expires in 24 hours</Text>
            <Text style={styles.rule}>✓ No repeat requests if ignored</Text>
            <Text style={styles.rule}>✓ Chat unlocks only after acceptance</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onSend}>
            <Text style={styles.primaryButtonText}>Send Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 16,
  },
  image: {
    width: 118,
    height: 118,
    borderRadius: 32,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.black,
  },
  text: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
    color: COLORS.gray,
  },
  senderPreview: {
    marginTop: 18,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 12,
  },
  senderImage: {
    width: 54,
    height: 54,
    borderRadius: 18,
    marginRight: 12,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.black,
  },
  senderMeta: {
    marginTop: 3,
    color: COLORS.gray,
  },
  ruleBox: {
    width: "100%",
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
  },
  rule: {
    color: "#374151",
    fontSize: 14,
    marginBottom: 8,
  },
  primaryButton: {
    width: "100%",
    marginTop: 24,
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: COLORS.gray,
    fontWeight: "700",
  },
});