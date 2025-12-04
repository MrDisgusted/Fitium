import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../components/Glass";

export default function WorkoutPlanner() {
  return (
    <ImageBackground
      source={require("../assets/wallpaper.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Workout Planner</Text>
          <Glass style={styles.card}>
            <Text style={styles.placeholder}>Coming soon</Text>
          </Glass>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  card: {
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
  },
});
