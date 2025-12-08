import { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RestDays() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalDays = Number(params.days);

  const [restDays, setRestDays] = useState<number[]>([]);

  const toggleRest = (i: number) => {
    if (restDays.includes(i)) {
      setRestDays(restDays.filter((x) => x !== i));
    } else {
      setRestDays([...restDays, i]);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, padding: 20, gap: 20 }}>
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          Rest Days
        </Text>

        <Glass style={{ padding: 20, borderRadius: 25 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            Select which days are rest
          </Text>

          {Array.from({ length: totalDays }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggleRest(i)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: restDays.includes(i)
                  ? "white"
                  : "rgba(255,255,255,0.15)",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: restDays.includes(i) ? "black" : "white",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Day {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </Glass>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/workout-builder/exercises",
              params: { days: totalDays, rest: JSON.stringify(restDays) },
            })
          }
          style={{
            marginTop: "auto",
            backgroundColor: "white",
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}
