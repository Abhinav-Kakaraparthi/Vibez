import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Button, FlatList, Image, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';

const API_BASE = 'http://localhost:8000/api';
const DEMO_USER_ID = 'user-a'; // Replace with authenticated user id.

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': DEMO_USER_ID,
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function App() {
  const [nearby, setNearby] = useState([]);
  const [note, setNote] = useState('');

  async function updateLocationAndFetch() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location needed', 'Enable location to find nearby people.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    await api('/location', {
      method: 'POST',
      body: JSON.stringify({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
    });

    const people = await api('/nearby');
    setNearby(people);
  }

  async function sendRequest(receiverId) {
    try {
      await api('/requests', {
        method: 'POST',
        body: JSON.stringify({ receiver_id: receiverId, note })
      });
      Alert.alert('Sent', 'Request sent. It expires in 24 hours.');
    } catch (e) {
      Alert.alert('Cannot send request', e.message);
    }
  }

  useEffect(() => {
    updateLocationAndFetch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>VibeZ</Text>
      <Text style={{ marginBottom: 16 }}>
        See nearby profile pictures only. Full details unlock only after acceptance.
      </Text>

      <TextInput
        placeholder="Optional note, max 100 chars"
        value={note}
        maxLength={100}
        onChangeText={setNote}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 16 }}
      />

      <Button title="Refresh nearby" onPress={updateLocationAndFetch} />

      <FlatList
        data={nearby}
        keyExtractor={(item) => item.user_id}
        numColumns={2}
        contentContainerStyle={{ paddingTop: 20 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%', margin: '1%', padding: 10, borderWidth: 1, borderRadius: 12 }}>
            <Image
              source={{ uri: item.profile_photo_url }}
              style={{ width: '100%', height: 150, borderRadius: 12, backgroundColor: '#eee' }}
            />
            <Text style={{ marginVertical: 8, textAlign: 'center' }}>Nearby now</Text>
            <Button title="Request" onPress={() => sendRequest(item.user_id)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}