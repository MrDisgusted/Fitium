import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View } from "react-native";
import Glass from "../../components/Glass";
import Calendar from "../../components/Calendar";
import MacroBar from "../../components/MacroBar";
import DailyCalories from "../../components/DailyCalories";
import { useState } from "react";
import { dailyCaloriesCalculation, caloriesFromMacros } from "../../controller/fitness";


export default function Index() {

  //all of this is a temporary placeholder for when i actually implement the user profile and shit
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
          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <Calendar bubbleSize={50} dimOpacity={1} />
          </Glass>

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <View style={{ marginTop: 20 }}>
              <MacroBar label="Carbs" value={macros.carbs} goal={macroGoals.carbs} color="#60ffd0"/>
              <MacroBar label="Protein" value={macros.protein} goal={macroGoals.protein} color="#2483ff" />
              <MacroBar label="Fats" value={macros.fats} goal={macroGoals.fats} color="#24b2ff"/>
            </View>
          </Glass>

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <DailyCalories calories={consumedCalories} />
          </Glass>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
