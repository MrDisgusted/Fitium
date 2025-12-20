import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground} from "react-native";
import Glass from "../../components/Glass";
import MacroBar from "../../components/MacroBar";
import HydrationBar from "../../components/HydrationBar";
import DailyCalories from "../../components/DailyCalories";
import EditNumberModal from "../../components/EditNumberModal";
import MealBuilderModal from "../../components/MealBuilderModal";
import MealSelector from "../../components/MealSelector";
import BarcodeScannerModal from "../../components/BarcodeScannerModal";
import ScannedFoodResultModal from "../../components/ScannedFoodResultModal";
import BarcodeScannerSection from "../../components/BarcodeScannerSection";
import { useNutrition } from "../../components/provider/NutritionProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";
import { dailyCaloriesCalculation } from "../../controller/fitness";
import { useMeal, Meal } from "../../components/provider/MealProvider";

export default function Diet() {
  const {
    macros,
    setMacros,
    calories,
    setCalories,
    macroGoals,
    calorieGoal,
    userInfo,
    hydration,
    setHydration,
    hydrationGoal,
  } = useNutrition();

  const { meals, addMeal, removeMeal } = useMeal();
  const { wallpaper } = useWallpaper();

  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [mealBuilderVisible, setMealBuilderVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedFood, setScannedFood] = useState<any>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const openEdit = (field: string, value: number) => {
    setEditField(field);
    setEditValue(value);
  };

  const saveEdit = (newVal: number) => {
    if (editField === "calories") {
      setCalories(newVal);
    } else if (editField === "hydration") {
      setHydration(newVal);
    } else if (editField && editField in macros) {
      setMacros({ ...macros, [editField]: newVal });
    }
    setEditField(null);
  };

  const computedCalorieGoal =
    calorieGoal && calorieGoal > 0
      ? calorieGoal
      : dailyCaloriesCalculation(userInfo);

  const handleMealSelect = (meal: Meal) => {
    // Add meal's macros to daily totals
    setCalories(calories + meal.calories);
    setMacros({
      ...macros,
      protein: macros.protein + meal.protein,
      carbs: macros.carbs + meal.carbs,
      fats: macros.fats + meal.fats,
    });
  };

  const handleSaveMeal = (meal: Meal) => {
    addMeal(meal);
  };

  const handleFoodScanned = (food: any) => {
    setScannedFood(food);
    setScannerVisible(false);
    setResultModalVisible(true);
  };

  const handleConsumeScannedFood = (food: any) => {
    setCalories(calories + food.calories);
    setMacros({
      ...macros,
      protein: macros.protein + food.protein,
      carbs: macros.carbs + food.carbs,
      fats: macros.fats + food.fats,
    });
    setResultModalVisible(false);
  };

  const handleDiscardScannedFood = () => {
    setResultModalVisible(false);
    setScannerVisible(true);
  };

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          <Text style={styles.sectionLabel}>Hydration</Text>

          <TouchableOpacity onPress={() => openEdit("hydration", hydration)}>
            <Glass style={styles.macroCard}>
              <HydrationBar value={hydration} goal={hydrationGoal} />
            </Glass>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setHydration(hydration + 100)}
            >
              <Glass style={styles.hydrationButton}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                  +100ml
                </Text>
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setHydration(hydration + 250)}
            >
              <Glass style={styles.hydrationButton}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                  +250ml
                </Text>
              </Glass>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setHydration(hydration + 500)}
            >
              <Glass style={styles.hydrationButton}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                  +500ml
                </Text>
              </Glass>
            </TouchableOpacity>
          </View>

          <BarcodeScannerSection onOpenScanner={() => setScannerVisible(true)} />

          <MealSelector
            meals={meals}
            onSelectMeal={handleMealSelect}
            onDeleteMeal={removeMeal}
            onCreateNew={() => setMealBuilderVisible(true)}
          />

          <EditNumberModal
            visible={!!editField}
            value={editValue}
            label={editField || ""}
            onClose={() => setEditField(null)}
            onSave={saveEdit}
          />

          <MealBuilderModal
            visible={mealBuilderVisible}
            onClose={() => setMealBuilderVisible(false)}
            onSave={handleSaveMeal}
          />

          <BarcodeScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onFoodScanned={handleFoodScanned}
          />

          <ScannedFoodResultModal
            visible={resultModalVisible}
            food={scannedFood}
            onConsume={handleConsumeScannedFood}
            onDiscard={handleDiscardScannedFood}
          />
        </ScrollView>
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
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
    backgroundColor: 'transparent',
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
  hydrationButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: -20,
  },
});
