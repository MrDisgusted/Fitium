import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter } from "expo-router";

export default function ChooseDays() {
  const router = useRouter();
  const [days, setDays] = useState(3);

  const options = [1, 2, 3, 4, 5, 6, 7];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          Create Workout Split
        </Text>

        <Glass style={{ padding: 20, borderRadius: 25 }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            How many days in your cycle?
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {options.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setDays(n)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  backgroundColor: days === n ? "white" : "rgba(255,255,255,0.15)",
                }}
              >
                <Text style={{ color: days === n ? "black" : "white", fontWeight: "700" }}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Glass>

        <TouchableOpacity
          onPress={() => router.push(`/workout-builder/rest-days?days=${days}`)}
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
      </View>
    </SafeAreaView>
  );
}
