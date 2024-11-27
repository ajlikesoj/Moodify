import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function HomeScreen({ navigation, route }) {
  const { userId } = route.params; // Pass userId from the login screen
  const [mood, setMood] = useState("");

  const generatePlaylist = async () => {
    try {
      // Replace YOUR_SERVER_URL with the actual URL of your backend
      const response = await axios.post(
        `http:////192.168.0.208:3001/generatePlaylist?userId=${userId}`,
        { keywords: mood }
      );

      const playlist = response.data.tracks;
      navigation.navigate("Playlist", { playlist });
    } catch (error) {
      console.error("Error generating playlist:", error);
      Alert.alert("Error", "Unable to generate playlist. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moodify</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a mood or keyword"
        value={mood}
        onChangeText={setMood}
      />
      <Button title="Generate Playlist" onPress={generatePlaylist} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
