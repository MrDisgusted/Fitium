import React, { createContext, useContext, useState, useEffect } from "react";
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
