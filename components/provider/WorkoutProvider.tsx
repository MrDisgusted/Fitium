import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const WorkoutContext = createContext(null);

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function WorkoutProvider({ children }) {
  const [splits, setSplits] = useState([]);
  const [activeSplitId, setActiveSplitId] = useState(null);
  const [mode, setMode] = useState("fixed");
  const [dynamicIndex, setDynamicIndex] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [useFixedWeekdays, setUseFixedWeekdays] = useState(true);


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const s1 = await AsyncStorage.getItem("workout_splits");
    const s2 = await AsyncStorage.getItem("workout_active_split");
    const s3 = await AsyncStorage.getItem("workout_mode");
    const s4 = await AsyncStorage.getItem("workout_dynamic_index");
    const s5 = await AsyncStorage.getItem("workout_last_date");

    if (s1) setSplits(JSON.parse(s1));
    if (s2) setActiveSplitId(JSON.parse(s2));
    if (s3) setMode(JSON.parse(s3));
    if (s4) setDynamicIndex(Number(JSON.parse(s4)));
    if (s5) setLastDate(JSON.parse(s5));
  };

  const persistSplits = async (next) => {
    setSplits(next);
    await AsyncStorage.setItem("workout_splits", JSON.stringify(next));
  };

  const activateSplit = async (id) => {
    setActiveSplitId(id);
    await AsyncStorage.setItem("workout_active_split", JSON.stringify(id));
    setDynamicIndex(0);
    await AsyncStorage.setItem("workout_dynamic_index", JSON.stringify(0));
  };

  const addSplit = async (split) => {
    const next = [...splits, split];
    await persistSplits(next);
    await activateSplit(split.id);
  };

  const updateSplit = async (id, updated) => {
    const next = splits.map((s) => (s.id === id ? updated : s));
    await persistSplits(next);
  };

  const deleteSplit = async (id) => {
    const next = splits.filter((s) => s.id !== id);
    await persistSplits(next);

    if (id === activeSplitId) {
      setActiveSplitId(null);
      await AsyncStorage.removeItem("workout_active_split");
    }
  };

  const setWorkoutMode = async (m) => {
    setMode(m);
    await AsyncStorage.setItem("workout_mode", JSON.stringify(m));
    if (m === "dynamic") {
      setDynamicIndex(0);
      await AsyncStorage.setItem("workout_dynamic_index", JSON.stringify(0));
      await AsyncStorage.setItem("workout_last_date", JSON.stringify(""));
    }
  };

  const activeSplit = splits.find((s) => s.id === activeSplitId) || null;

  const todayKey = () => {
    const idx = new Date().getDay();
    const map = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return map[idx];
  };

  const dynamicAdvanceCheck = async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!lastDate) {
      setLastDate(today);
      await AsyncStorage.setItem("workout_last_date", JSON.stringify(today));
      return;
    }
    if (lastDate !== today) {
      const nextIndex = activeSplit
      ? (dynamicIndex + 1) % activeSplit.days.filter((day: any) => !day.rest).length
      : 0;

      setDynamicIndex(nextIndex);
      await AsyncStorage.setItem(
        "workout_dynamic_index",
        JSON.stringify(nextIndex)
      );

      setLastDate(today);
      await AsyncStorage.setItem("workout_last_date", JSON.stringify(today));
    }
  };

  useEffect(() => {
    if (mode === "dynamic" && activeSplit) {
      dynamicAdvanceCheck();
    }
  }, [mode, activeSplit]);

  const getTrainingDays = () => {
    if (!activeSplit) return [];
    return DAYS.filter((d) => !activeSplit.days[d].rest);
  };

  const getTodayWorkout = () => {
    if (!activeSplit) return null;

    if (mode === "fixed") {
      const key = todayKey();
      return { key, day: activeSplit.days[key] };
    }

    const trainingDays = getTrainingDays();
    if (trainingDays.length === 0) return null;

    const key = trainingDays[dynamicIndex];
    return { key, day: activeSplit.days[key] };
  };

  const getTomorrowWorkout = () => {
    if (!activeSplit) return null;

    if (mode === "fixed") {
      const idx = new Date().getDay();
      const map = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const nextKey = map[(idx + 1) % 7];
      return { key: nextKey, day: activeSplit.days[nextKey] };
    }

    const trainingDays = getTrainingDays();
    if (trainingDays.length === 0) return null;

    const nextIndex = (dynamicIndex + 1) % trainingDays.length;
    const key = trainingDays[nextIndex];
    return { key, day: activeSplit.days[key] };
  };

  return (
    <WorkoutContext.Provider
      value={{
        splits,
        activeSplit,
        activeSplitId,
        mode,
        addSplit,
        updateSplit,
        deleteSplit,
        activateSplit,
        setWorkoutMode,
        getTodayWorkout,
        getTomorrowWorkout,
        useFixedWeekdays,
        setUseFixedWeekdays,
        DAYS,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}
