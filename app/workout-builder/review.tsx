import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import * as Crypto from "expo-crypto";

export default function ReviewSplit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addSplit } = useWorkout();

  const raw = params.data;
  const parsed =
    Array.isArray(raw) ? JSON.parse(raw[0] || "[]") : JSON.parse(raw || "[]");

  const [splitName, setSplitName] = useState("My Split");

  const save = async () => {
    const cleaned = parsed.map((d) => ({
      name: d.rest ? "" : d.name,
      rest: d.rest,
      exercises: d.rest
        ? []
        : d.exercises.map((ex) => ({
            id: Crypto.randomUUID(),
            name: ex.name,
            weight: ex.weight,
            reps: ex.reps,
            sets: ex.sets,
            increase: ex.increase,
            suggestedIncrease: ex.increase,
          })),
    }));

    const split = {
      id: Crypto.randomUUID(),
      name: splitName,
      days: cleaned,
    };

    await addSplit(split);
    router.replace("/(tabs)/workouts");
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
            Review Split
          </Text>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={{ color: "white", fontSize: 16, marginBottom: 10 }}>
              Split Name
            </Text>

            <TextInput
              value={splitName}
              onChangeText={setSplitName}
              placeholder="Name your split..."
              placeholderTextColor="#aaa"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: 12,
                borderRadius: 12,
                color: "white",
                fontSize: 16,
              }}
            />
          </Glass>

          {parsed.map((day, i) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
                Day {i + 1}
              </Text>

              {day.rest ? (
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                  Rest Day
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      marginBottom: 10,
                      fontWeight: "600",
                    }}
                  >
                    {day.name || "(no name)"}
                  </Text>

                  {day.exercises.length === 0 ? (
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 15,
                      }}
                    >
                      No exercises added
                    </Text>
                  ) : (
                    day.exercises.map((ex, idx) => (
                      <View
                        key={idx}
                        style={{ marginBottom: 12, gap: 3 }}
                      >
                        <Text style={{ color: "white", fontSize: 16 }}>
                          {ex.name}
                        </Text>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: 14,
                          }}
                        >
                          {ex.weight}kg × {ex.reps} reps × {ex.sets} sets
                        </Text>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 14,
                          }}
                        >
                          Weekly +{ex.increase}kg
                        </Text>
                      </View>
                    ))
                  )}
                </>
              )}
            </Glass>
          ))}

          <TouchableOpacity
            onPress={save}
            style={{
              paddingVertical: 16,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "700", color: "black" }}
            >
              Save Split
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
