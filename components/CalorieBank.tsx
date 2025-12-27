import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

type Props = {
  calorieBank: number;
  weightGoal: number;
  currentWeight: number;
};

export default function CalorieBank({ calorieBank, weightGoal, currentWeight }: Props) {
  const caloriesNeeded = Math.max(0, (currentWeight * 7700) - (weightGoal * 7700));
  const progressPercent = caloriesNeeded > 0 ? Math.min(100, ((caloriesNeeded - calorieBank) / caloriesNeeded) * 100) : 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Calorie Debt
      </Text>

      <View style={{ gap: 8 }}>
        <View
          style={{
            height: 40,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 38,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: "rgba(96, 255, 208, 0.3)",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: "#60ffd0",
              borderRadius: 18,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>

        <Text style={{ color: "white", fontSize: 18, fontWeight: "700", textAlign: "center" }}>
          {calorieBank.toLocaleString()} kcal
        </Text>
      </View>
    </View>
  );
}
