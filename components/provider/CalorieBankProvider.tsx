import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CalorieBankContextType {
  calorieBank: number;
  setCalorieBank: (bank: number) => void;
  updateCalorieBankAfterBurn: (caloriesBurned: number) => Promise<void>;
  weightGoal: number;
  setWeightGoal: (goal: number) => void;
  isCalorieBankEnabled: boolean;
  setIsCalorieBankEnabled: (enabled: boolean) => void;
  currentWeight: number;
  setCurrentWeight: (weight: number) => void;
  initializeCalorieBank: (weight: number) => Promise<void>;
}

const CalorieBankContext = createContext<CalorieBankContextType | undefined>(undefined);

export function CalorieBankProvider({ children }: { children: React.ReactNode }) {
  const [calorieBank, setCalorieBank] = useState(0);
  const [weightGoal, setWeightGoal] = useState(0);
  const [isCalorieBankEnabled, setIsCalorieBankEnabled] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);

  // Load calorie bank data from storage
  useEffect(() => {
    loadCalorieBankData();
  }, []);

  const loadCalorieBankData = async () => {
    try {
      const [bankData, goalData, enabledData, weightData] = await Promise.all([
        AsyncStorage.getItem("calorieBank"),
        AsyncStorage.getItem("weightGoal"),
        AsyncStorage.getItem("isCalorieBankEnabled"),
        AsyncStorage.getItem("currentWeightForBank"),
      ]);

      if (bankData) setCalorieBank(JSON.parse(bankData));
      if (goalData) setWeightGoal(JSON.parse(goalData));
      if (enabledData) setIsCalorieBankEnabled(JSON.parse(enabledData));
      if (weightData) setCurrentWeight(JSON.parse(weightData));
    } catch (error) {
      console.error("Failed to load calorie bank data", error);
    }
  };

  // Initialize calorie bank based on current weight
  const initializeCalorieBank = async (weight: number) => {
    try {
      setCurrentWeight(weight);
      await AsyncStorage.setItem("currentWeightForBank", JSON.stringify(weight));
      
      // Only initialize if there's no existing bank value
      const existingBank = await AsyncStorage.getItem("calorieBank");
      if (!existingBank) {
        // Calculate initial calorie bank: weight * 7700
        const initialBank = weight * 7700;
        setCalorieBank(initialBank);
        await AsyncStorage.setItem("calorieBank", JSON.stringify(initialBank));
      }
    } catch (error) {
      console.error("Failed to initialize calorie bank", error);
    }
  };

  // Update calorie bank when user burns calories
  const updateCalorieBankAfterBurn = async (caloriesBurned: number) => {
    try {
      const newBank = Math.max(0, calorieBank - caloriesBurned);
      setCalorieBank(newBank);
      await AsyncStorage.setItem("calorieBank", JSON.stringify(newBank));
    } catch (error) {
      console.error("Failed to update calorie bank", error);
    }
  };

  // Save weight goal to storage and recalculate calorie bank
  useEffect(() => {
    AsyncStorage.setItem("weightGoal", JSON.stringify(weightGoal));
    
    // Recalculate calorie bank when weight goal changes
    if (weightGoal > 0 && currentWeight > 0) {
      const newCalorieBank = Math.max(0, (currentWeight * 7700) - (weightGoal * 7700));
      setCalorieBank(newCalorieBank);
      AsyncStorage.setItem("calorieBank", JSON.stringify(newCalorieBank));
    }
  }, [weightGoal]);

  // Save enabled state to storage
  useEffect(() => {
    AsyncStorage.setItem("isCalorieBankEnabled", JSON.stringify(isCalorieBankEnabled));
  }, [isCalorieBankEnabled]);

  // Save calorie bank to storage
  useEffect(() => {
    AsyncStorage.setItem("calorieBank", JSON.stringify(calorieBank));
  }, [calorieBank]);

  return (
    <CalorieBankContext.Provider
      value={{
        calorieBank,
        setCalorieBank,
        updateCalorieBankAfterBurn,
        weightGoal,
        setWeightGoal,
        isCalorieBankEnabled,
        setIsCalorieBankEnabled,
        currentWeight,
        setCurrentWeight,
        initializeCalorieBank,
      }}
    >
      {children}
    </CalorieBankContext.Provider>
  );
}

export function useCalorieBank() {
  const context = useContext(CalorieBankContext);
  if (!context) {
    throw new Error("useCalorieBank must be used within CalorieBankProvider");
  }
  return context;
}
