import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View, TouchableOpacity, Image } from "react-native";
import Glass from "../../components/Glass";
import Calendar from "../../components/Calendar";
import MacroBar from "../../components/MacroBar";
import DailyCalories from "../../components/DailyCalories";
import { useState } from "react";
import { Link } from "expo-router";
import { dailyCaloriesCalculation, caloriesFromMacros } from "../../controller/fitness";

export default function Index() {

  //i will change this, these are just temporary values i swear

  const [macros, setMacros] = useState({
    carbs: 5,
    protein: 18,
    fats: 2,
  });

  const [macroGoals, setMacroGoals] = useState({
    carbs: 20,
    protein: 180,
    fats: 50,
  });

  const consumedCalories = caloriesFromMacros(macros);

  const userData = {
    weight: 70,
    height: 175,
    age: 21,
    gender: "male",
    activity: 1.55
  };

  const calorieGoal = dailyCaloriesCalculation(userData);

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
            <Link href="/profile" asChild>
              <TouchableOpacity>
                <Image
                  source={require("../../assets/profile.png")}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 99,
                  }}
                />
              </TouchableOpacity>
            </Link>
          </View>

          <Glass style={{ padding: 10, borderRadius: 30, marginBottom: 20, marginTop: 10 }}>
            <Calendar bubbleSize={41} dimOpacity={1} />
          </Glass>

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <View style={{ marginTop: 20 }}>
              <MacroBar label="Carbs" value={macros.carbs} goal={macroGoals.carbs} color="#60ffd0" />
              <MacroBar label="Protein" value={macros.protein} goal={macroGoals.protein} color="#2483ff" />
              <MacroBar label="Fats" value={macros.fats} goal={macroGoals.fats} color="#24b2ff" />
            </View>
              <Glass style={{ padding: 8, borderRadius: 25, marginBottom: -7, marginTop: 15 }}>
                <DailyCalories calories={consumedCalories} />
              </Glass>
          </Glass>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
