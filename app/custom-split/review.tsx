import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import * as Crypto from "expo-crypto";

export default function ReviewSplit() {
  const router = useRouter();
  const { workouts } = useLocalSearchParams();
  const parsed = JSON.parse(workouts as string);

  const { saveCustomSplit, useFixedWeekdays } = useWorkout();

  const handleSave = () => {
    const split = {
      id: String(Crypto.randomUUID),
      name: "My Split",
      days: parsed,
      useFixedWeekdays,
    };

    saveCustomSplit(split);
    router.replace("/custom-split/choose-split");
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
            Review Split
          </Text>

          {parsed.map((day: any, i: number) => (
            <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
              <Text style={{ color: "white", fontSize: 22, marginBottom: 12 }}>
                {day.rest ? "Rest Day" : day.name || `Day ${i + 1}`}
              </Text>

              {!day.rest &&
                day.exercises.map((ex: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {ex.name}
                    </Text>

                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                      {ex.weight} kg × {ex.reps} reps × {ex.sets} sets
                    </Text>

                    <Text style={{ color: "#60ffd0", fontSize: 14 }}>
                      +{ex.increase} kg / week
                    </Text>
                  </View>
                ))}
            </Glass>
          ))}

          <TouchableOpacity
            onPress={handleSave}
            style={{
              padding: 16,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontSize: 18, fontWeight: "700" }}>
              Save Split
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
