import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  View,
} from "react-native";
import BackgroundGlow from "../components/BackgroundGlow";
import { usePhotoPicker } from "../hooks/usePhotoPicker";
import { COLORS } from "../constants/theme";

export default function ProfileScreen({ onCreateProfile }) {
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoUri, setPhotoUri] = useState(null);

  const { takePhoto, uploadPhoto } = usePhotoPicker(setPhotoUri);

  const createProfile = () => {
    if (!firstName || !age || !gender || !photoUri) {
      Alert.alert("Missing info", "Please complete all fields and add a photo.");
      return;
    }

    onCreateProfile({
      id: "user-a",
      firstName,
      age,
      gender,
      photoUri,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <BackgroundGlow />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>VibeZ</Text>
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>
          People only see this after you send them a request.
        </Text>

        <TouchableOpacity style={styles.photoBox} onPress={uploadPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.photoText}>Add profile photo</Text>
          )}
        </TouchableOpacity>

        <View style={styles.photoActions}>
          <TouchableOpacity style={styles.smallButton} onPress={takePhoto}>
            <Text style={styles.smallButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallButton} onPress={uploadPhoto}>
            <Text style={styles.smallButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />

        <TouchableOpacity style={styles.button} onPress={createProfile}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 20 },
  container: { paddingTop: 70, paddingBottom: 40 },
  logo: { fontSize: 42, fontWeight: "900", color: COLORS.black, textAlign: "center" },
  title: { marginTop: 28, fontSize: 28, fontWeight: "900", color: COLORS.black },
  subtitle: { marginTop: 8, color: COLORS.gray, lineHeight: 22, marginBottom: 22 },
  photoBox: {
    width: 150,
    height: 150,
    borderRadius: 38,
    backgroundColor: COLORS.lightGray,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  photo: { width: "100%", height: "100%" },
  photoText: { color: COLORS.gray, fontWeight: "700" },
  photoActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  smallButtonText: { color: COLORS.purple, fontWeight: "900" },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    width: "100%",
    marginTop: 24,
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "900" },
});