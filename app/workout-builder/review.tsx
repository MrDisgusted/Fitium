import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWorkout } from "../../components/provider/WorkoutProvider";

export default function Review() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addSplit } = useWorkout();

  const rawWorkouts = Array.isArray(params.names) ? params.names[0] : params.names;
  const workouts = JSON.parse(rawWorkouts || "[]");

  const save = () => {
    const split = {
      id: Date.now().toString(),
      days: workouts,
    };
    addSplit(split);
    router.navigate("/(tabs)/workouts");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>Review</Text>

        <ScrollView contentContainerStyle={{ gap: 14, marginTop: 20 }}>
          {workouts.map((day, i) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 20, gap: 8 }}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
                {day.name}
              </Text>

              {day.rest ? (
                <Text style={{ color: "rgba(255,255,255,0.7)" }}>Rest Day</Text>
              ) : (
                day.exercises.map((ex) => (
                  <Text key={ex.id} style={{ color: "white", fontSize: 16 }}>
                    • {ex.name} — {ex.weight}kg × {ex.reps} reps × {ex.sets} sets (+{ex.increase}kg)
                  </Text>
                ))
              )}
            </Glass>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={save}
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 20,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "black", fontSize: 18, fontWeight: "700" }}>
            Save Split
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
