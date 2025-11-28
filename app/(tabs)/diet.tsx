import React, { useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { caloriesFromMacros, dailyCaloriesCalculation } from "../../controller/fitness";

export default function Diet() {

  //again this is all temporary and will be changed wallah ill remove this but for now ill see the values displayed
  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const [macroGoals, setMacroGoals] = useState({
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const consumedCalories = caloriesFromMacros(macros);

  const userData = {
    weight: 70,
    height: 175,
    age: 21,
    gender: "male",
    activity: 1.55,
  };

  const calorieGoal = dailyCaloriesCalculation(userData);
  const caloriePercent = Math.min(consumedCalories / calorieGoal, 1);

  return (
    <ImageBackground
          source={require("../../assets/wallpaper.png")}
          style={{ flex: 1 }}
          resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20, gap: 20 }}>
          
          <Glass style={{ padding: 20 }}>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
              Calories
            </Text>

            <Text style={{ color: "white", fontSize: 30, fontWeight: "900", marginTop: 10 }}>
              {consumedCalories} / {calorieGoal} kcal
            </Text>

            <View
              style={{
                height: 12,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                marginTop: 12,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${caloriePercent * 100}%`,
                  backgroundColor: "white",
                }}
              />
            </View>
          </Glass>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Glass style={{ padding: 15, width: "32%" }}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                Protein
              </Text>
              <Text style={{ color: "white", marginTop: 6 }}>
                {macros.protein} / {macroGoals.protein} g
              </Text>
            </Glass>

            <Glass style={{ padding: 15, width: "32%" }}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                Carbs
              </Text>
              <Text style={{ color: "white", marginTop: 6 }}>
                {macros.carbs} / {macroGoals.carbs} g
              </Text>
            </Glass>

            <Glass style={{ padding: 15, width: "32%" }}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                Fats
              </Text>
              <Text style={{ color: "white", marginTop: 6 }}>
                {macros.fats} / {macroGoals.fats} g
              </Text>
            </Glass>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
