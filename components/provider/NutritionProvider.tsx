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

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [macrosData, calorieData, goalsData, calorieGoalData, userInfoData] = await Promise.all([
          AsyncStorage.getItem("macros"),
          AsyncStorage.getItem("calories"),
          AsyncStorage.getItem("macroGoals"),
          AsyncStorage.getItem("calorieGoal"),
          AsyncStorage.getItem("userInfo"),
        ]);

        if (macrosData) setMacros(JSON.parse(macrosData));
        if (calorieData) setCalories(JSON.parse(calorieData));
        if (goalsData) setMacroGoals(JSON.parse(goalsData));
        if (calorieGoalData) setCalorieGoal(JSON.parse(calorieGoalData));
        if (userInfoData) setUserInfo(JSON.parse(userInfoData));
      } catch (error) {
        console.error("Error loading nutrition data:", error);
      }
    };

    loadData();
  }, []);

  // Persist macros whenever they change
  useEffect(() => {
    AsyncStorage.setItem("macros", JSON.stringify(macros));
  }, [macros]);

  // Persist calories whenever they change
  useEffect(() => {
    AsyncStorage.setItem("calories", JSON.stringify(calories));
  }, [calories]);

  // Persist macro goals whenever they change
  useEffect(() => {
    AsyncStorage.setItem("macroGoals", JSON.stringify(macroGoals));
  }, [macroGoals]);

  // Persist calorie goal whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("calorieGoal", JSON.stringify(calorieGoal));
  }, [calorieGoal]);

  // Persist user info whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  // Update calories based on macros
  useEffect(() => {
    setCalories(caloriesFromMacros(macros));
  }, [macros]);

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
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  return useContext(NutritionContext);
}
