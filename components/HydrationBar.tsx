import React from "react";
import { View, Text } from "react-native";

interface HydrationBarProps {
  value: number;
  goal: number;
}

export default function HydrationBar({ value, goal }: HydrationBarProps) {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
          Hydration
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
          {value} / {goal} ml
        </Text>
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: "rgba(96, 255, 208, 0.2)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: "#60ffd0",
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}
