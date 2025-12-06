import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter } from "expo-router";
import { useWorkout } from "../../components/provider/WorkoutProvider";

export default function CreateSplit() {
  const router = useRouter();
  const { useFixedWeekdays, setUseFixedWeekdays } = useWorkout();

  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [restDays, setRestDays] = useState<number[]>([]);

  const toggleRest = (index: number) => {
    if (restDays.includes(index)) {
      setRestDays(restDays.filter((i) => i !== index));
    } else {
      setRestDays([...restDays, index]);
    }
  };

  const canContinue = daysPerWeek > 0;

  const renderDayLabel = (index: number) => {
    if (useFixedWeekdays) {
      const w = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return w[index];
    }
    return `Day ${index + 1}`;
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
            Create Split
          </Text>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={{ color: "white", fontSize: 20, marginBottom: 12 }}>
              Schedule Type
            </Text>

            <TouchableOpacity
              onPress={() => setUseFixedWeekdays(!useFixedWeekdays)}
              style={{
                padding: 14,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {useFixedWeekdays ? "📅 Fixed Weekdays" : "🔁 Dynamic Rotation"}
              </Text>
            </TouchableOpacity>

            <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
              Days Per Week
            </Text>

            <TextInput
              keyboardType="numeric"
              value={String(daysPerWeek)}
              onChangeText={(v) => setDaysPerWeek(Number(v) || 0)}
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                padding: 12,
                borderRadius: 10,
                color: "white",
                fontSize: 18,
                marginBottom: 20,
              }}
            />

            <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
              Rest Days
            </Text>

            <View style={{ gap: 10 }}>
              {Array.from({ length: daysPerWeek }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleRest(index)}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    backgroundColor: restDays.includes(index)
                      ? "rgba(255,100,100,0.4)"
                      : "rgba(255,255,255,0.12)",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {renderDayLabel(index)} {restDays.includes(index) ? "(Rest)" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Glass>

          <TouchableOpacity
            disabled={!canContinue}
            onPress={() =>
              router.push({
                pathname: "/custom-split/exercises",
                params: {
                  days: daysPerWeek,
                  restDays: JSON.stringify(restDays),
                },
              })
            }
            style={{
              padding: 16,
              borderRadius: 20,
              backgroundColor: canContinue ? "white" : "rgba(255,255,255,0.3)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: canContinue ? "black" : "rgba(0,0,0,0.4)",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
