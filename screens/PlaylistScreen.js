import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SongItem from "../components/SongItem";

export default function PlaylistScreen({ route }) {
  const { playlist } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Songs</Text>
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
    backgroundColor: "#333",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  regenerateButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  regenerateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
