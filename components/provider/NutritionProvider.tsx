import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { caloriesFromMacros } from "../../controller/fitness";

const NutritionContext = createContext<any>(null);

export function NutritionProvider({ children }) {
  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const [calories, setCalories] = useState(0);
  const [lastCalories, setLastCalories] = useState(0);

  const [macroGoals, setMacroGoals] = useState({
    carbs: 200,
    protein: 90,
    fats: 70,
  });

  const [calorieGoal, setCalorieGoal] = useState(0);

  const [userInfo, setUserInfo] = useState({
    age: 21,
    gender: "male",
    weight: 70,
    height: 175,
    activity: 1.55,
  });

  const [hydration, setHydration] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(3000);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [macrosData, calorieData, goalsData, calorieGoalData, userInfoData, hydrationData, hydrationGoalData, lastHydrationDateData] = await Promise.all([
          AsyncStorage.getItem("macros"),
          AsyncStorage.getItem("calories"),
          AsyncStorage.getItem("macroGoals"),
          AsyncStorage.getItem("calorieGoal"),
          AsyncStorage.getItem("userInfo"),
          AsyncStorage.getItem("hydration"),
          AsyncStorage.getItem("hydrationGoal"),
          AsyncStorage.getItem("lastHydrationDate"),
        ]);

        if (macrosData) setMacros(JSON.parse(macrosData));
        if (calorieData) {
          const calorieVal = JSON.parse(calorieData);
          setCalories(calorieVal);
          setLastCalories(calorieVal);
        }
        if (goalsData) setMacroGoals(JSON.parse(goalsData));
        if (calorieGoalData) setCalorieGoal(JSON.parse(calorieGoalData));
        if (userInfoData) setUserInfo(JSON.parse(userInfoData));
        if (hydrationGoalData) setHydrationGoal(JSON.parse(hydrationGoalData));

        const today = new Date().toDateString();
        const lastHydrationDate = lastHydrationDateData ? JSON.parse(lastHydrationDateData) : null;

        if (lastHydrationDate !== today) {
          setHydration(0);
          await AsyncStorage.setItem("lastHydrationDate", JSON.stringify(today));
        } else if (hydrationData) {
          setHydration(JSON.parse(hydrationData));
        }
      } catch (error) {
        console.error("Error loading nutrition data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("macros", JSON.stringify(macros));
  }, [macros]);

  useEffect(() => {
    AsyncStorage.setItem("calories", JSON.stringify(calories));
  }, [calories]);

  useEffect(() => {
    AsyncStorage.setItem("macroGoals", JSON.stringify(macroGoals));
  }, [macroGoals]);

  useEffect(() => {
    AsyncStorage.setItem("calorieGoal", JSON.stringify(calorieGoal));
  }, [calorieGoal]);

  useEffect(() => {
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    AsyncStorage.setItem("hydration", JSON.stringify(hydration));
  }, [hydration]);

  useEffect(() => {
    AsyncStorage.setItem("hydrationGoal", JSON.stringify(hydrationGoal));
  }, [hydrationGoal]);

  useEffect(() => {
    setCalories(caloriesFromMacros(macros));
  }, [macros]);

  // Handle calorie debt updates when calories change
  useEffect(() => {
    const updateCalorieBankIfEnabled = async () => {
      try {
        const isCalorieBankEnabled = await AsyncStorage.getItem("isCalorieBankEnabled");
        if (isCalorieBankEnabled && JSON.parse(isCalorieBankEnabled)) {
          const caloriesDifference = calories - lastCalories;
          if (caloriesDifference > 0) {
            // Calories increased, which means user burned calories
            const currentBank = await AsyncStorage.getItem("calorieBank");
            if (currentBank) {
              const bankValue = JSON.parse(currentBank);
              const newBank = Math.max(0, bankValue - caloriesDifference);
              await AsyncStorage.setItem("calorieBank", JSON.stringify(newBank));
            }
          }
          setLastCalories(calories);
        } else {
          setLastCalories(calories);
        }
      } catch (error) {
        console.error("Error updating calorie debt:", error);
      }
    };

    updateCalorieBankIfEnabled();
  }, [calories]);

  return (
    <NutritionContext.Provider
      value={{
        macros,
        setMacros,
        calories,
        setCalories,
        macroGoals,
        setMacroGoals,
        calorieGoal,
        setCalorieGoal,
        userInfo,
        setUserInfo,
        hydration,
        setHydration,
        hydrationGoal,
        setHydrationGoal,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  return useContext(NutritionContext);
}
