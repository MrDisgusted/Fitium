import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ExercisesSetup() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const totalDays = Number(params.days);
  const restDaysParam = params.rest;
  const restDays: number[] = Array.isArray(restDaysParam)
    ? JSON.parse(restDaysParam[0] || "[]")
    : JSON.parse(restDaysParam || "[]");

  const [days, setDays] = useState(
    Array.from({ length: totalDays }).map((_, i) => ({
      index: i,
      name: "",
      rest: restDays.includes(i),
      exercises: [],
    }))
  );

  const updateDayName = (i: number, val: string) => {
    const copy = [...days];
    copy[i].name = val;
    setDays(copy);
  };

  const addExercise = (dayIndex: number) => {
    const copy = [...days];
    copy[dayIndex].exercises.push({
      name: "",
      weight: 0,
      reps: 0,
      sets: 0,
      increase: 0,
    });
    setDays(copy);
  };

  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: string,
    val: any
  ) => {
    const copy = [...days];
    copy[dayIndex].exercises[exIndex][field] = val;
    setDays(copy);
  };

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Text style={{ fontSize: 32, color: "white", fontWeight: "bold" }}>
            Define Training Days
          </Text>

          {days.map((day, i) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
                Day {i + 1}
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
                      backgroundColor: "rgba(255,255,255,0.15)",
                      padding: 12,
                      borderRadius: 12,
                      color: "white",
                      marginBottom: 15,
                    }}
                  />

                  {day.exercises.map((ex, exIndex) => (
                    <View
                      key={exIndex}
                      style={{ marginBottom: 20, gap: 10 }}
                    >
                      <TextInput
                        placeholder="Exercise Name"
                        placeholderTextColor="#aaa"
                        value={ex.name}
                        onChangeText={(v) =>
                          updateExercise(i, exIndex, "name", v)
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Weight (kg)"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.weight)}
                        onChangeText={(v) =>
                          updateExercise(
                            i,
                            exIndex,
                            "weight",
                            Number(v) || 0
                          )
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Reps"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.reps)}
                        onChangeText={(v) =>
                          updateExercise(
                            i,
                            exIndex,
                            "reps",
                            Number(v) || 0
                          )
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Sets"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.sets)}
                        onChangeText={(v) =>
                          updateExercise(
                            i,
                            exIndex,
                            "sets",
                            Number(v) || 0
                          )
                        }
                        style={styles.input}
                      />

                      <TextInput
                        placeholder="Weekly Increase (kg)"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={String(ex.increase)}
                        onChangeText={(v) =>
                          updateExercise(
                            i,
                            exIndex,
                            "increase",
                            Number(v) || 0
                          )
                        }
                        style={styles.input}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => addExercise(i)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: "white",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
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
                pathname: "/workout-builder/review",
                params: { data: JSON.stringify(days) },
              })
            }
            style={{
              paddingVertical: 16,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "black" }}>
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
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 12,
    color: "white",
    fontSize: 16,
  },
};
