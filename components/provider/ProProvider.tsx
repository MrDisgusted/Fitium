import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProContextType {
  isPro: boolean;
  proMonths: number;
  setPro: (months: number) => void;
  removePro: () => void;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [proMonths, setProMonths] = useState(0);

  useEffect(() => {
    loadProStatus();
  }, []);

  const loadProStatus = async () => {
    try {
      const data = await AsyncStorage.getItem("fitiumPro");
      if (data) {
        const { isPro, months } = JSON.parse(data);
        setIsPro(isPro);
        setProMonths(months);
      }
    } catch (error) {
      console.error("Failed to load pro status", error);
    }
  };

  const setPro = async (months: number) => {
    try {
      setIsPro(true);
      setProMonths(months);
      await AsyncStorage.setItem(
        "fitiumPro",
        JSON.stringify({ isPro: true, months })
      );
    } catch (error) {
      console.error("Failed to save pro status", error);
    }
  };

  const removePro = async () => {
    try {
      setIsPro(false);
      setProMonths(0);
      await AsyncStorage.removeItem("fitiumPro");
    } catch (error) {
      console.error("Failed to remove pro status", error);
    }
  };

  return (
    <ProContext.Provider value={{ isPro, proMonths, setPro, removePro }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (!context) {
    throw new Error("usePro must be used within ProProvider");
  }
  return context;
}
