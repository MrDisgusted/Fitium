import { View, Text } from "react-native";
import React from "react";

type Props = {
  calories: number;
  goal?: number;
};

export default function DailyCalories({ calories, goal }: Props) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Daily Calories
      </Text>

      <Text style={{ color: "white", fontSize: 26, fontWeight: "900" }}>
        {calories} {goal ? `/ ${goal}` : ""} kcal
      </Text>
    </View>
  );
}
