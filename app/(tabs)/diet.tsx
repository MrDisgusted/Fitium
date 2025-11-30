import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import Glass from "../../components/Glass";
import MacroBar from "../../components/MacroBar";
import DailyCalories from "../../components/DailyCalories";
import { dailyCaloriesCalculation, caloriesFromMacros } from "../../controller/fitness";
import EditNumberModal from "../../components/EditNumberModal";

export default function Diet() {
  const [macros, setMacros] = useState({
    carbs: 160,
    protein: 55,
    fats: 40,
  });

  const [macroGoals, setMacroGoals] = useState({
    carbs: 200,
    protein: 90,
    fats: 70,
  });

  const [calories, setCalories] = useState(caloriesFromMacros(macros));

  useEffect(() => {
    setCalories(caloriesFromMacros(macros));
  }, [macros]);

  const userData = {
    weight: 70,
    height: 175,
    age: 21,
    gender: "male",
    activity: 1.55,
  };

  const calorieGoal = dailyCaloriesCalculation(userData);

  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const openEdit = (field: string, value: number) => {
    setEditField(field);
    setEditValue(value);
  };

  const saveEdit = (newVal: number) => {
    if (editField === "calories") {
      setCalories(newVal);
    } else if (editField && editField in macros) {
      setMacros({ ...macros, [editField]: newVal });
    }
    setEditField(null);
  };

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20, gap: 20 }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
            Diet
          </Text>

          <TouchableOpacity onPress={() => openEdit("calories", calories)}>
            <Glass style={{ padding: 20, borderRadius: 25 }}>
              <DailyCalories calories={calories} goal={calorieGoal} />
            </Glass>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={{ width: "32%" }}
              onPress={() => openEdit("carbs", macros.carbs)}
            >
              <Glass style={{ padding: 15 }}>
                <MacroBar
                  label="Carbs"
                  value={macros.carbs}
                  goal={macroGoals.carbs}
                  color="#60ffd0"
                />
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "32%" }}
              onPress={() => openEdit("protein", macros.protein)}
            >
              <Glass style={{ padding: 15 }}>
                <MacroBar
                  label="Protein"
                  value={macros.protein}
                  goal={macroGoals.protein}
                  color="#2483ff"
                />
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "32%" }}
              onPress={() => openEdit("fats", macros.fats)}
            >
              <Glass style={{ padding: 15 }}>
                <MacroBar
                  label="Fats"
                  value={macros.fats}
                  goal={macroGoals.fats}
                  color="#24b2ff"
                />
              </Glass>
            </TouchableOpacity>
          </View>

          <EditNumberModal
            visible={!!editField}
            value={editValue}
            label={editField || ""}
            onClose={() => setEditField(null)}
            onSave={saveEdit}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
