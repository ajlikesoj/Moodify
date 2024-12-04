import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

export default function SongItem({ song }) {
  const openSongLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open the link.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Error opening link:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: song.album.images[0]?.url }}
        style={styles.albumArt}
      />
      <View style={styles.textContainer}>
        <Text style={styles.songTitle}>{song.name}</Text>
        <Text style={styles.artist}>
          {song.artists.map((artist) => artist.name).join(", ")}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openSongLink(song.external_urls.spotify)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  artist: {
    fontSize: 14,
    color: "#ccc",
  },
  addButton: {
    backgroundColor: "#888",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
