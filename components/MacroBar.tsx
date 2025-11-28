import { View, Text } from "react-native";
import React from "react";

type MacroBarProps = {
  label: string;
  value: number;
  goal: number;       
  color: string;      
};

export default function MacroBar({ label, value, goal, color }: MacroBarProps) {
  const percent = Math.min(value / goal, 1);

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          {label}
        </Text>
        <Text style={{ color: "white", fontSize: 14 }}>
          {value}g / {goal}g
        </Text>
      </View>

      <View
        style={{
          height: 12,
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 20,
          marginTop: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percent * 100}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}
