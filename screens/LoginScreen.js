import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState("unique_user_id"); // Replace with logic to fetch/generate a userId

  const handleLogin = async () => {
    try {
      // Replace YOUR_BACKEND_URL with your actual backend URL
      const loginUrl = `http://192.168.0.208:3001/login?userId=${userId}`;

      // Open Spotify login page in a browser
      const result = await WebBrowser.openBrowserAsync(loginUrl);

      if (result.type === "dismiss") {
        Alert.alert(
          "Login Canceled",
          "You closed the login page without logging in."
        );
      } else {
        // Confirm that the user was authenticated
        const userResponse = await axios.get(
          `http://192.168.0.208:3001/getUser?userId=${userId}`
        );

        if (userResponse.data.success) {
          Alert.alert("Success", "You are now logged in!");
          navigation.navigate("Home", { userId });
        } else {
          Alert.alert("Error", "Unable to verify login. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Unable to log in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Moodify</Text>
      <Text style={styles.subtitle}>
        Log in with your Spotify account to generate playlists based on your
        listening history.
      </Text>
      <Button title="Login with Spotify" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
});
