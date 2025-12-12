import React, { createContext, useContext, useState } from "react";
import { Ingredient } from "../../constants/ingredients";

export interface MealIngredient extends Ingredient {
  quantity: number; // multiplier for the serving size
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: MealIngredient[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isCustom: boolean; // true if user created it
}

interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  updateMeal: (mealId: string, meal: Meal) => void;
  customIngredients: Ingredient[];
  addCustomIngredient: (ingredient: Ingredient) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((m) => m.id !== mealId));
  };

  const updateMeal = (mealId: string, updatedMeal: Meal) => {
    setMeals(
      meals.map((m) => (m.id === mealId ? updatedMeal : m))
    );
  };

  const addCustomIngredient = (ingredient: Ingredient) => {
    if (!customIngredients.find((i) => i.id === ingredient.id)) {
      setCustomIngredients([...customIngredients, ingredient]);
    }
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        addMeal,
        removeMeal,
        updateMeal,
        customIngredients,
        addCustomIngredient,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMeal must be used within a MealProvider");
  }
  return context;
};
