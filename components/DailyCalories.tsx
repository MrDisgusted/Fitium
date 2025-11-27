import { View, Text } from "react-native";
import React from "react";

type Props = {
  calories: number;
};

export default function DailyCalories({ calories }: Props) {
  return (
    <View style={{ marginTop: 1 }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
        Daily Calories
      </Text>

      <Text style={{ color: "white", fontSize: 32, fontWeight: "800", marginTop: 5 }}>
        {calories} kcal
      </Text>
    </View>
  );
}
