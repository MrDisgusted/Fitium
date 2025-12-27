import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProContextType {
  isPro: boolean;
  proMonths: number;
  setPro: (months: number) => void;
  removePro: () => void;
  expirationDate: Date | null;
  cancelSubscription: () => void;
  isCalorieBankEnabled: boolean;
  setIsCalorieBankEnabled: (enabled: boolean) => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [proMonths, setProMonths] = useState(0);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isCalorieBankEnabled, setIsCalorieBankEnabledState] = useState(false);

  useEffect(() => {
    loadProStatus();
  }, []);

  const loadProStatus = async () => {
    try {
      const [proData, calorieBankData] = await Promise.all([
        AsyncStorage.getItem("fitiumPro"),
        AsyncStorage.getItem("isCalorieBankEnabled"),
      ]);

      if (proData) {
        const { isPro, months, expirationDate } = JSON.parse(proData);
        setIsPro(isPro);
        setProMonths(months);
        if (expirationDate) {
          setExpirationDate(new Date(expirationDate));
        }
      }

      if (calorieBankData) {
        setIsCalorieBankEnabledState(JSON.parse(calorieBankData));
      }
    } catch (error) {
      console.error("Failed to load pro status", error);
    }
  };

  const setPro = async (months: number) => {
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);      
      setIsPro(true);
      setProMonths(months);
      setExpirationDate(expiry);
      await AsyncStorage.setItem(
        "fitiumPro",
        JSON.stringify({ 
          isPro: true, 
          months,
          expirationDate: expiry.toISOString()
        })
      );
    } catch (error) {
      console.error("Failed to save pro status", error);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsPro(false);
      setProMonths(0);
      setExpirationDate(null);
      setIsCalorieBankEnabledState(false);
      await AsyncStorage.removeItem("fitiumPro");
      await AsyncStorage.setItem("isCalorieBankEnabled", JSON.stringify(false));
    } catch (error) {
      console.error("Failed to cancel subscription", error);
    }
  };

  const removePro = async () => {
    try {
      setIsPro(false);
      setProMonths(0);
      setExpirationDate(null);
      setIsCalorieBankEnabledState(false);
      await AsyncStorage.removeItem("fitiumPro");
      await AsyncStorage.setItem("isCalorieBankEnabled", JSON.stringify(false));
    } catch (error) {
      console.error("Failed to remove pro status", error);
    }
  };

  const setIsCalorieBankEnabled = async (enabled: boolean) => {
    try {
      setIsCalorieBankEnabledState(enabled);
      await AsyncStorage.setItem("isCalorieBankEnabled", JSON.stringify(enabled));
    } catch (error) {
      console.error("Failed to set calorie debt enabled", error);
    }
  };

  return (
    <ProContext.Provider value={{ isPro, proMonths, setPro, removePro, expirationDate, cancelSubscription, isCalorieBankEnabled, setIsCalorieBankEnabled }}>
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
