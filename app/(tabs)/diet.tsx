import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from "react-native";
import Glass from "../../components/Glass";
import MacroBar from "../../components/MacroBar";
import DailyCalories from "../../components/DailyCalories";
import EditNumberModal from "../../components/EditNumberModal";
import { dailyCaloriesCalculation } from "../../controller/fitness";
import { useNutrition } from "../../components/provider/NutritionProvider";

export default function Diet() {
  const {
    macros,
    setMacros,
    calories,
    setCalories,
    macroGoals,
    calorieGoal,
    userInfo,
  } = useNutrition();

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

  const computedCalorieGoal =
    calorieGoal && calorieGoal > 0
      ? calorieGoal
      : dailyCaloriesCalculation(userInfo);

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Diet</Text>

          <TouchableOpacity onPress={() => openEdit("calories", calories)}>
            <Glass style={styles.calorieCard}>
              <DailyCalories calories={calories} goal={computedCalorieGoal} />
            </Glass>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Add Macros</Text>

          <View style={styles.macroRow}>
            <TouchableOpacity
              style={styles.macroWrapper}
              onPress={() => openEdit("carbs", macros.carbs)}
            >
              <Glass style={styles.macroCard}>
                <MacroBar
                  label="Carbs"
                  value={macros.carbs}
                  goal={macroGoals.carbs}
                  color="#60ffd0"
                />
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.macroWrapper}
              onPress={() => openEdit("protein", macros.protein)}
            >
              <Glass style={styles.macroCard}>
                <MacroBar
                  label="Protein"
                  value={macros.protein}
                  goal={macroGoals.protein}
                  color="#2483ff"
                />
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.macroWrapper}
              onPress={() => openEdit("fats", macros.fats)}
            >
              <Glass style={styles.macroCard}>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  calorieCard: {
    padding: 15,
    borderRadius: 25,
  },
  sectionLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  macroRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  macroWrapper: {
    width: "100%",
  },
  macroCard: {
    padding: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
});
