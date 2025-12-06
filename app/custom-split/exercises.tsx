import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWorkout } from "../../components/provider/WorkoutProvider";

export default function Exercises() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { useFixedWeekdays } = useWorkout();

  const restDaysParam = params.restDays;

  const restDays: number[] = Array.isArray(restDaysParam)
    ? JSON.parse(restDaysParam[0] || "[]")
    : JSON.parse(restDaysParam || "[]");

  const weekdayCount = useFixedWeekdays ? 7 : Number(params.days || 1);

  const [workouts, setWorkouts] = useState<
    { name: string; exercises: any[]; rest: boolean }[]
  >(
    Array.from({ length: weekdayCount }).map((_, i) => ({
      name: "",
      exercises: [],
      rest: restDays.includes(i),
    }))
  );

  const addExercise = (dayIndex: number) => {
    const updated = [...workouts];
    updated[dayIndex].exercises.push({
      name: "",
      weight: 0,
      reps: 0,
      sets: 0,
      increase: 0,
    });
    setWorkouts(updated);
  };

  const updateExercise = (dayIndex: number, exIndex: number, field: string, val: any) => {
    const updated = [...workouts];
    updated[dayIndex].exercises[exIndex][field] = val;
    setWorkouts(updated);
  };

  const updateDayName = (dayIndex: number, name: string) => {
    const updated = [...workouts];
    updated[dayIndex].name = name;
    setWorkouts(updated);
  };

  const renderLabel = (i: number) => {
    if (useFixedWeekdays) {
      const w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      return w[i];
    }
    return `Day ${i + 1}`;
  };

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
            Training Days
          </Text>

          {workouts.map((day, i) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
                {renderLabel(i)}
              </Text>

              {day.rest ? (
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
                  Rest Day
                </Text>
              ) : (
                <>
                  <TextInput
                    placeholder="Name this training day"
                    placeholderTextColor="#aaa"
                    value={day.name}
                    onChangeText={(v) => updateDayName(i, v)}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      padding: 12,
                      borderRadius: 10,
                      color: "white",
                      marginBottom: 15,
                      fontSize: 16,
                    }}
                  />

                  {day.exercises.map((ex, exIndex) => (
                    <View key={exIndex} style={{ gap: 10, marginBottom: 20 }}>
                      <TextInput
                        placeholder="Exercise Name"
                        placeholderTextColor="#aaa"
                        value={ex.name}
                        onChangeText={(v) => updateExercise(i, exIndex, "name", v)}
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Weight (kg)"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.weight)}
                        onChangeText={(v) =>
                          updateExercise(i, exIndex, "weight", Number(v) || 0)
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Reps"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.reps)}
                        onChangeText={(v) =>
                          updateExercise(i, exIndex, "reps", Number(v) || 0)
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Sets"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.sets)}
                        onChangeText={(v) =>
                          updateExercise(i, exIndex, "sets", Number(v) || 0)
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Weekly Increase (kg)"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.increase)}
                        onChangeText={(v) =>
                          updateExercise(i, exIndex, "increase", Number(v) || 0)
                        }
                        style={styles.input}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => addExercise(i)}
                  >
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>
                      + Add Exercise
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Glass>
          ))}

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/custom-split/review",
                params: {
                  workouts: JSON.stringify(workouts),
                },
              })
            }
            style={{
              padding: 16,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontSize: 18, fontWeight: "700" }}>
              Review Split
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = {
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 12,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 5,
  },
};
