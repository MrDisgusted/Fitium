import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../components/Glass";
import { useWorkout } from "../components/provider/WorkoutProvider";

export default function ChooseSplit() {
  const { splits, activeSplitId, activateSplit, deleteSplit } = useWorkout();

  return (
    <ImageBackground
      source={require("../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text style={styles.title}>Choose a Split</Text>

          {splits.map((split) => {
            const dayCount = split.days.filter((day: any) => !day.rest).length;

            return (
              <Glass key={split.id} style={styles.card}>
                <Text style={styles.splitName}>{split.name}</Text>
                <Text style={styles.dayCount}>{dayCount} training days</Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => activateSplit(split.id)}
                    style={[
                      styles.btn,
                      split.id === activeSplitId && styles.activeBtn,
                    ]}
                  >
                    <Text style={styles.btnText}>
                      {split.id === activeSplitId ? "Active" : "Set Active"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteSplit(split.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Glass>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  card: { padding: 20, borderRadius: 22 },
  splitName: { color: "white", fontSize: 20, fontWeight: "700" },
  dayCount: { color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  activeBtn: { backgroundColor: "rgba(120,255,180,0.5)" },
  deleteBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,70,70,0.3)",
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 15, fontWeight: "600" },
});
