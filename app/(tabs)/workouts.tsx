import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function Workouts() {
  const router = useRouter();
  const { getTodayWorkout, getTomorrowWorkout, mode } = useWorkout();

  const today = getTodayWorkout();
  const tomorrow = getTomorrowWorkout();

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Workouts</Text>
            <TouchableOpacity
              onPress={() => router.push("/workout-planner")}
              style={styles.plannerBtn}
            >
              <Text style={styles.plannerText}>Planner</Text>
            </TouchableOpacity>
          </View>

          <Glass style={styles.card}>
            {today ? (
              <>
                <Text style={styles.subLabel}>
                  {mode === "fixed" ? "Today" : "Current Day"}
                </Text>
                <Text style={styles.dayName}>{today.day.name}</Text>
              </>
            ) : (
              <>
                <Text style={styles.subLabel}>Today</Text>
                <Text style={styles.dayName}>Rest Day</Text>
              </>
            )}

            {tomorrow && (
              <Text style={styles.tomorrowText}>
                {mode === "fixed" ? "Tomorrow" : "Next"}: {tomorrow.day.name}
              </Text>
            )}
          </Glass>

          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {today && today.day.exercises.length > 0 ? (
              today.day.exercises.map((ex) => (
                <Glass key={ex.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseInfo}>
                    {ex.weight}kg × {ex.reps} reps × {ex.sets} sets
                  </Text>
                </Glass>
              ))
            ) : (
              <Text style={styles.restText}>No exercises today.</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  plannerBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.15)" },
  plannerText: { color: "white", fontSize: 14, fontWeight: "600" },
  card: { padding: 20, borderRadius: 22 },
  subLabel: { color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 4 },
  dayName: { color: "white", fontSize: 24, fontWeight: "700" },
  tomorrowText: { marginTop: 10, color: "rgba(255,255,255,0.7)", fontSize: 15 },
  exerciseCard: { padding: 18, borderRadius: 20 },
  exerciseName: { color: "white", fontSize: 18, fontWeight: "700" },
  exerciseInfo: { color: "rgba(255,255,255,0.8)", marginTop: 6, fontSize: 15 },
  restText: { color: "rgba(255,255,255,0.7)", marginTop: 20, fontSize: 16 },
});
