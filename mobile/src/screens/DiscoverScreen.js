import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

import BackgroundGlow from "../components/BackgroundGlow";
import FaceCard from "../components/FaceCard";
import RequestModal from "../components/RequestModal";
import { COLORS, SHADOW } from "../constants/theme";
import { DEMO_USERS } from "../data/demoUsers";
import {
  updateLocation,
  getNearbyUsers,
  sendConnectionRequest,
} from "../services/api";

export default function DiscoverScreen({ profile }) {
  const [users, setUsers] = useState(DEMO_USERS);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusText, setStatusText] = useState(
    "Demo profiles shown until real users join"
  );

  useEffect(() => {
    refreshNearby();
  }, []);

  const refreshNearby = async () => {
    try {
      setLoading(true);
      setStatusText("Looking around...");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setStatusText("Location permission is needed");
        setUsers(DEMO_USERS);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      await updateLocation(
        location.coords.latitude,
        location.coords.longitude
      );

      const data = await getNearbyUsers();

      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        setStatusText(`${data.length} people nearby`);
      } else {
        setUsers(DEMO_USERS);
        setStatusText("No real users nearby yet");
      }
    } catch (error) {
      console.log("Nearby error:", error);
      setUsers(DEMO_USERS);
      setStatusText("Showing demo mode");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUser) return;

    try {
      if (!selectedUser.user_id.startsWith("demo")) {
        await sendConnectionRequest(selectedUser.user_id);
      }

      setSelectedUser(null);

      Alert.alert(
        "Request sent",
        "They can see your full profile now. If they accept within 24 hours, chat unlocks."
      );
    } catch (error) {
      console.log("Request error:", error);
      Alert.alert("Could not send request", "Try again in a moment.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <BackgroundGlow />

      <View style={styles.header}>
        <Text style={styles.logo}>VibeZ</Text>
        <Text style={styles.tagline}>
          Faces nearby. Details only after consent.
        </Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>Nearby</Text>
            <Text style={styles.panelSubtitle}>
              Tap a face to send one request
            </Text>
          </View>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>0.1 mi</Text>
          </View>
        </View>

        <Text style={styles.helperText}>{statusText}</Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.purple} />
            <Text style={styles.loadingText}>Finding nearby vibes...</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            numColumns={2}
            keyExtractor={(item) => item.user_id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <FaceCard user={item} onPress={() => setSelectedUser(item)} />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.floatingWidget} onPress={refreshNearby}>
        <Text style={styles.widgetIcon}>⌁</Text>
      </TouchableOpacity>

      <RequestModal
        selectedUser={selectedUser}
        profile={profile}
        onSend={handleSendRequest}
        onClose={() => setSelectedUser(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 58,
    paddingBottom: 24,
    alignItems: "center",
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.black,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  panel: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 30,
    padding: 18,
    marginBottom: 108,
    ...SHADOW,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.black,
  },
  panelSubtitle: {
    marginTop: 4,
    color: "#8A8F98",
    fontSize: 13,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.purple,
    marginRight: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.blue,
  },
  helperText: {
    marginTop: 14,
    marginBottom: 14,
    fontSize: 13,
    color: COLORS.gray,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.gray,
  },
  grid: {
    paddingBottom: 20,
  },
  floatingWidget: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    width: 96,
    height: 56,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 30,
    elevation: 14,
    borderWidth: 1,
    borderColor: "rgba(74,144,226,0.35)",
  },
  widgetIcon: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.purple,
  },
});