import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import SongItem from "../components/SongItem";

export default function PlaylistScreen({ route }) {
  const { playlist } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Generated Playlist</Text>
      <FlatList
        data={playlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
