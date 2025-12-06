import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../components/Glass";
import { useWorkout } from "../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function WorkoutPlanner() {
  const router = useRouter();
  const { splits, activeSplitId, activateSplit, deleteSplit, mode, setWorkoutMode } = useWorkout();

  return (
    <ImageBackground
      source={require("../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text style={styles.title}>Workout Planner</Text>

          <Glass style={styles.modeCard}>
            <TouchableOpacity onPress={() => setWorkoutMode("fixed")} style={styles.modeRow}>
              <Text style={styles.modeText}>Fixed Weekdays</Text>
              <Text style={styles.modeVal}>{mode === "fixed" ? "●" : "○"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setWorkoutMode("dynamic")} style={styles.modeRow}>
              <Text style={styles.modeText}>Dynamic Rotation</Text>
              <Text style={styles.modeVal}>{mode === "dynamic" ? "●" : "○"}</Text>
            </TouchableOpacity>
          </Glass>

          <Text style={styles.subtitle}>Your Splits</Text>

          {splits.map((split) => (
            <Glass key={split.id} style={styles.splitCard}>
              <Text style={styles.splitName}>{split.name}</Text>

              <View style={styles.btnRow}>
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
          ))}

          <TouchableOpacity onPress={() => router.push("/custom-split")}>
            <Glass style={styles.createBtn}>
              <Text style={styles.createText}>Create Your Own Split</Text>
            </Glass>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "white", fontSize: 22, marginTop: 10 },
  modeCard: { padding: 20, borderRadius: 22, gap: 14 },
  modeRow: { flexDirection: "row", justifyContent: "space-between" },
  modeText: { color: "white", fontSize: 18 },
  modeVal: { color: "white", fontSize: 20 },
  splitCard: { padding: 20, borderRadius: 22 },
  splitName: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 10 },
  btnRow: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center" },
  btnText: { color: "white", fontSize: 15, fontWeight: "600" },
  activeBtn: { backgroundColor: "rgba(120,255,180,0.5)" },
  deleteBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "rgba(255,70,70,0.3)", alignItems: "center" },
  createBtn: { padding: 18, borderRadius: 22, marginTop: 20 },
  createText: { color: "white", fontSize: 18, textAlign: "center" },
});
