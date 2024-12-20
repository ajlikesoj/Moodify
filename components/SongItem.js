import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SongItem({ song }) {
  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{song.name}</Text>
      <Text style={styles.artist}>
        {song.artists.map((artist) => artist.name).join(", ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
    color: "gray",
  },
});
