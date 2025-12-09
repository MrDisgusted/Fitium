import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams, router } from "expo-router";

export default function Exercises() {
  const params = useLocalSearchParams();

  const rawDays = Array.isArray(params.days) ? params.days[0] : params.days;
  const rawNames = Array.isArray(params.names) ? params.names[0] : params.names;
  const rawRest = Array.isArray(params.rest) ? params.rest[0] : params.rest;

  const days = Number(rawDays);
  const names = JSON.parse(rawNames || "[]");
  const rest = JSON.parse(rawRest || "[]");


  const [workouts, setWorkouts] = useState(
    Array.from({ length: days }).map((_, i) => ({
      name: names[i],
      rest: rest.includes(i),
      exercises: [],
    }))
  );

  const addExercise = (i) => {
    const copy = [...workouts];
    copy[i].exercises.push({
      id: Date.now().toString() + Math.random(),
      name: "",
      weight: 0,
      reps: 0,
      sets: 0,
      increase: 0,
    });
    setWorkouts(copy);
  };

  const update = (day, ex, key, val) => {
    const copy = [...workouts];
    copy[day].exercises[ex][key] = val;
    setWorkouts(copy);
  };

  return (
    <ImageBackground source={require("../../assets/wallpaper.png")} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>Exercises</Text>

          {workouts.map((d, i) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>{d.name}</Text>

              {d.rest ? (
                <Text style={{ color: "rgba(255,255,255,0.7)" }}>Rest Day</Text>
              ) : (
                <>
                  {d.exercises.map((ex, exIndex) => (
                    <View key={ex.id} style={{ gap: 10, marginBottom: 15 }}>
                      <TextInput
                        placeholder="Exercise Name"
                        placeholderTextColor="#aaa"
                        value={ex.name}
                        onChangeText={(v) => update(i, exIndex, "name", v)}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                          padding: 12,
                          borderRadius: 10,
                          color: "white",
                        }}
                      />

                      <TextInput
                        placeholder="Weight (kg)"
                        placeholderTextColor="#aaa"
                        value={String(ex.weight)}
                        onChangeText={(v) => update(i, exIndex, "weight", Number(v))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                          padding: 12,
                          borderRadius: 10,
                          color: "white",
                        }}
                      />

                      <TextInput
                        placeholder="Reps"
                        placeholderTextColor="#aaa"
                        value={String(ex.reps)}
                        onChangeText={(v) => update(i, exIndex, "reps", Number(v))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                          padding: 12,
                          borderRadius: 10,
                          color: "white",
                        }}
                      />

                      <TextInput
                        placeholder="Sets"
                        placeholderTextColor="#aaa"
                        value={String(ex.sets)}
                        onChangeText={(v) => update(i, exIndex, "sets", Number(v))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                          padding: 12,
                          borderRadius: 10,
                          color: "white",
                        }}
                      />

                      <TextInput
                        placeholder="Overload Increase (kg)"
                        placeholderTextColor="#aaa"
                        value={String(ex.increase)}
                        onChangeText={(v) => update(i, exIndex, "increase", Number(v))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                          padding: 12,
                          borderRadius: 10,
                          color: "white",
                        }}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => addExercise(i)}
                    style={{
                      backgroundColor: "white",
                      padding: 12,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "black", fontWeight: "700" }}>+ Add Exercise</Text>
                  </TouchableOpacity>
                </>
              )}
            </Glass>
          ))}

          <TouchableOpacity
            onPress={() =>
              router.navigate({
                pathname: "/workout-builder/review",
                params: { workouts: JSON.stringify(workouts) },
              })
            }
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontSize: 18, fontWeight: "700" }}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
