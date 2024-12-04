import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const [mood, setMood] = useState("");

  const generatePlaylist = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.72:3001/generatePlaylist",
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
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter Desired Mood"
        value={mood}
        onChangeText={setMood}
        placeholderTextColor="#aaa"
      />

      {/* Generate Playlist Button */}
      <TouchableOpacity style={styles.button} onPress={generatePlaylist}>
        <Text style={styles.buttonText}>Generate Playlist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 500,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#444",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#555",
  },
  button: {
    backgroundColor: "#888",
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#556",
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    paddingVertical: 15,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#ddd",
  },
});
