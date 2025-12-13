import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RestDays() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const days = Number(params.days);
  const rawNames = Array.isArray(params.names) ? params.names[0] : params.names;
  const names = JSON.parse(rawNames || "[]");


  const [rest, setRest] = useState([]);

  const toggle = (i) => {
    if (rest.includes(i)) setRest(rest.filter((x) => x !== i));
    else setRest([...rest, i]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>Rest Days</Text>

        <Glass style={{ padding: 20, borderRadius: 25, gap: 16 }}>
          {Array.from({ length: days }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggle(i)}
              style={{
                padding: 14,
                borderRadius: 14,
                backgroundColor: rest.includes(i) ? "white" : "rgba(255,255,255,0.15)",
              }}
            >
              <Text
                style={{
                  color: rest.includes(i) ? "black" : "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {names[i]}
              </Text>
            </TouchableOpacity>
          ))}
        </Glass>

        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: "/workout-builder/exercises",
              params: {
                days,
                names: JSON.stringify(names),
                rest: JSON.stringify(rest),
              },
            })
          }
          style={{
            backgroundColor: "white",
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
