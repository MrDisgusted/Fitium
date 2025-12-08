import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [splits, setSplits] = useState([]);
  const [activeSplitId, setActiveSplitId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const s1 = await AsyncStorage.getItem("splits");
    const s2 = await AsyncStorage.getItem("activeSplitId");
    const s3 = await AsyncStorage.getItem("currentIndex");
    const s4 = await AsyncStorage.getItem("lastDate");

    if (s1) setSplits(JSON.parse(s1));
    if (s2) setActiveSplitId(JSON.parse(s2));
    if (s3) setCurrentIndex(JSON.parse(s3));
    if (s4) setLastDate(JSON.parse(s4));
  };

  const persistSplits = async (next) => {
    setSplits(next);
    await AsyncStorage.setItem("splits", JSON.stringify(next));
  };

  const activateSplit = async (id) => {
    setActiveSplitId(id);
    await AsyncStorage.setItem("activeSplitId", JSON.stringify(id));
    setCurrentIndex(0);
    await AsyncStorage.setItem("currentIndex", JSON.stringify(0));
    await AsyncStorage.setItem("lastDate", JSON.stringify(""));
  };

  const addSplit = async (split) => {
    const next = [...splits, split];
    await persistSplits(next);
    await activateSplit(split.id);
  };

  const deleteSplit = async (id) => {
    const next = splits.filter((s) => s.id !== id);
    await persistSplits(next);
    if (id === activeSplitId) {
      setActiveSplitId(null);
      await AsyncStorage.removeItem("activeSplitId");
    }
  };

  const activeSplit = splits.find((s) => s.id === activeSplitId) || null;

  const advanceIfNeeded = async () => {
    if (!activeSplit) return;

    const today = new Date().toISOString().slice(0, 10);

    if (lastDate === today) return;

    const len = activeSplit.days.length;
    const next = (currentIndex + 1) % len;

    setCurrentIndex(next);
    await AsyncStorage.setItem("currentIndex", JSON.stringify(next));
    setLastDate(today);
    await AsyncStorage.setItem("lastDate", JSON.stringify(today));
  };

  useEffect(() => {
    advanceIfNeeded();
  }, [activeSplit]);

  const getTodayWorkout = () => {
    if (!activeSplit || !Array.isArray(activeSplit.days)) return null;
    const day = activeSplit.days[currentIndex];
    if (!day) return null;
    return { index: currentIndex, day };
  };


  const getTomorrowWorkout = () => {
    if (!activeSplit || !Array.isArray(activeSplit.days)) return null;
    const len = activeSplit.days.length;
    if (len === 0) return null;
    const next = (currentIndex + 1) % len;
    const day = activeSplit.days[next];
    if (!day) return null;
    return { index: next, day };
  };


  return (
    <WorkoutContext.Provider
      value={{
        splits,
        addSplit,
        deleteSplit,
        activateSplit,
        activeSplit,
        activeSplitId,
        getTodayWorkout,
        getTomorrowWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}
