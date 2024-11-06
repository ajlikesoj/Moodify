import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const [mood, setMood] = useState("");

  const generatePlaylist = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/generate-playlist",
        { mood }
      );
      const playlist = response.data;
      navigation.navigate("Playlist", { playlist });
    } catch (error) {
      console.error("Error generating playlist:", error);
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
