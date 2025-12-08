import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [splits, setSplits] = useState([]);
  const [activeSplitId, setActiveSplitId] = useState(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [todayState, setTodayState] = useState({ finished: [], overloadUsed: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s1 = await AsyncStorage.getItem("wp_splits");
    const s2 = await AsyncStorage.getItem("wp_active");
    const s3 = await AsyncStorage.getItem("wp_cycleIndex");
    const s4 = await AsyncStorage.getItem("wp_lastDate");
    const s5 = await AsyncStorage.getItem("wp_todayState");

    if (s1) setSplits(JSON.parse(s1));
    if (s2) setActiveSplitId(JSON.parse(s2));
    if (s3) setCycleIndex(JSON.parse(s3));
    if (s4) setLastDate(JSON.parse(s4));
    if (s5) setTodayState(JSON.parse(s5));
  };

  const persistSplits = async (next) => {
    setSplits(next);
    await AsyncStorage.setItem("wp_splits", JSON.stringify(next));
  };

  const activateSplit = async (id) => {
    setActiveSplitId(id);
    await AsyncStorage.setItem("wp_active", JSON.stringify(id));
    setCycleIndex(0);
    await AsyncStorage.setItem("wp_cycleIndex", JSON.stringify(0));
    resetTodayState();
  };

  const addSplit = async (split) => {
    const next = [...splits, split];
    await persistSplits(next);
    await activateSplit(split.id);
  };

  const deleteSplit = async (id) => {
    const next = splits.filter((x) => x.id !== id);
    await persistSplits(next);
    if (activeSplitId === id) {
      setActiveSplitId(null);
      await AsyncStorage.removeItem("wp_active");
    }
  };

  const activeSplit = splits.find((x) => x.id === activeSplitId) || null;

  const autoAdvance = async () => {
    if (!activeSplit) return;
    const today = new Date().toISOString().slice(0, 10);
    if (!lastDate) {
      setLastDate(today);
      await AsyncStorage.setItem("wp_lastDate", JSON.stringify(today));
      return;
    }
    if (today !== lastDate) {
      const next = (cycleIndex + 1) % activeSplit.days.length;
      setCycleIndex(next);
      await AsyncStorage.setItem("wp_cycleIndex", JSON.stringify(next));
      setLastDate(today);
      await AsyncStorage.setItem("wp_lastDate", JSON.stringify(today));
      resetTodayState();
    }
  };

  useEffect(() => {
    autoAdvance();
  }, [activeSplit, cycleIndex]);

  const today = activeSplit ? activeSplit.days[cycleIndex] : null;
  const tomorrow = activeSplit ? activeSplit.days[(cycleIndex + 1) % activeSplit.days.length] : null;

  const resetTodayState = () => {
    const state = { finished: [], overloadUsed: [] };
    setTodayState(state);
    AsyncStorage.setItem("wp_todayState", JSON.stringify(state));
  };

  const finishExercise = (id) => {
    const next = { ...todayState, finished: [...todayState.finished, id] };
    setTodayState(next);
    AsyncStorage.setItem("wp_todayState", JSON.stringify(next));
  };

  const applyOverload = (dayIndex, exId) => {
    const split = activeSplit;
    if (!split) return;

    const updatedSplit = { ...split };
    const exercise = updatedSplit.days[dayIndex].exercises.find((x) => x.id === exId);
    if (!exercise) return;

    exercise.weight += exercise.suggestedIncrease;

    const nextSplits = splits.map((s) => (s.id === split.id ? updatedSplit : s));
    persistSplits(nextSplits);

    const state = { ...todayState, overloadUsed: [...todayState.overloadUsed, exId] };
    setTodayState(state);
    AsyncStorage.setItem("wp_todayState", JSON.stringify(state));
  };

  const nextDay = async () => {
    if (!activeSplit) return;
    const next = (cycleIndex + 1) % activeSplit.days.length;
    setCycleIndex(next);
    await AsyncStorage.setItem("wp_cycleIndex", JSON.stringify(next));
    resetTodayState();
  };

  return (
    <WorkoutContext.Provider
      value={{
        splits,
        addSplit,
        deleteSplit,
        activateSplit,
        activeSplit,
        today,
        tomorrow,
        cycleIndex,
        finishExercise,
        applyOverload,
        nextDay,
        todayState,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}
